import os
from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory, session, abort
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

# Config
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'ppt', 'pptx'}

app = Flask(__name__)
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fastparhai.db'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    profile_pic = db.Column(db.String(200), nullable=True)
    notes = db.relationship('Note', backref='uploader', lazy=True)

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    course = db.Column(db.String(100), nullable=False)
    semester = db.Column(db.String(20), nullable=False)
    filename = db.Column(db.String(200), nullable=False)
    uploader_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    author = db.relationship('User', backref='questions')
    answers = db.relationship('Answer', backref='question', lazy=True)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    author = db.relationship('User', backref='answers')

class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Routes
@app.route('/')
def index():
    # Example: pass some featured notes
    notes = Note.query.order_by(Note.id.desc()).limit(6).all()
    return render_template('index.html', notes=notes)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        try:
            name = request.form['name']
            email = request.form['email']
            subject = request.form['subject']
            message = request.form['message']
            
            contact_msg = ContactMessage(name=name, email=email, subject=subject, message=message)
            db.session.add(contact_msg)
            db.session.commit()
            
            flash('Your message has been sent successfully!', 'success')
            return redirect(url_for('contact'))
        except Exception as e:
            flash('There was an error sending your message. Please try again.', 'error')
            return redirect(url_for('contact'))
            
    return render_template('contact.html')

@app.route('/browse-notes')
def browse_notes():
    # Dummy filter/search logic
    semesters = ['1', '2', '3', '4', '5', '6', '7', '8']
    courses = ['CS101', 'CS102', 'CS201', 'CS202']
    notes = Note.query.all()
    page = int(request.args.get('page', 1))
    has_next = False  # Add real pagination if needed
    return render_template('browse-notes.html', notes=notes, semesters=semesters, courses=courses, page=page, has_next=has_next)

@app.route('/note/<int:note_id>')
def note_details(note_id):
    note = Note.query.get_or_404(note_id)
    # Dummy related notes
    related_notes = Note.query.filter(Note.id != note_id).limit(3).all()
    return render_template('note-details.html', note=note, related_notes=related_notes)

@app.route('/forum')
def forum():
    questions = Question.query.order_by(Question.created_at.desc()).all()
    return render_template('forum.html', questions=questions)

@app.route('/answer', methods=['POST'])
@login_required
def answer():
    question_id = request.form['question_id']
    content = request.form['answer']
    answer = Answer(content=content, author_id=current_user.id, question_id=question_id)
    db.session.add(answer)
    db.session.commit()
    flash('Your answer has been submitted!')
    return redirect(url_for('forum'))

@app.route('/profile')
@login_required
def profile():
    print('DEBUG: Current user:', current_user.username, current_user.email)
    user_notes = Note.query.filter_by(uploader_id=current_user.id).all()
    uploads_count = len(user_notes)
    return render_template('profile.html', user_notes=user_notes, uploads_count=uploads_count)

@app.route('/settings', methods=['GET', 'POST'])
@login_required
def settings():
    if request.method == 'POST':
        # Save settings logic
        flash('Settings updated!')
        return redirect(url_for('settings'))
    return render_template('settings.html')

@app.route('/admin-dashboard')
@login_required
def admin_dashboard():
    if not current_user.is_admin:
        abort(403)
    total_users = User.query.count()
    total_notes = Note.query.count()
    recent_notes = Note.query.order_by(Note.id.desc()).limit(10).all()
    recent_users = User.query.order_by(User.id.desc()).limit(10).all()
    return render_template(
        'admin-dashboard.html',
        total_users=total_users,
        total_notes=total_notes,
        recent_notes=recent_notes,
        recent_users=recent_users
    )

@app.route('/admin/manage-resources')
@login_required
def manage_resources():
    if not current_user.is_admin:
        abort(403)
    notes = Note.query.order_by(Note.id.desc()).all()
    return render_template('manage-resources.html', notes=notes)

@app.route('/admin/delete-note/<int:note_id>', methods=['POST'])
@login_required
def delete_note(note_id):
    if not current_user.is_admin:
        abort(403)
    note = Note.query.get_or_404(note_id)
    # Delete the file from uploads folder
    try:
        os.remove(os.path.join(app.config['UPLOAD_FOLDER'], note.filename))
    except OSError:
        pass  # File might not exist
    # Delete from database
    db.session.delete(note)
    db.session.commit()
    flash('Note deleted successfully!')
    return redirect(url_for('manage_resources'))

@app.route('/upload-notes', methods=['GET', 'POST'])
@login_required
def upload_notes():
    if request.method == 'POST':
        title = request.form['title']
        course = request.form['course']
        semester = request.form['semester']
        category = request.form.get('category', '')
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            note = Note(title=title, course=course, semester=semester, filename=filename, uploader_id=current_user.id)
            db.session.add(note)
            db.session.commit()
            flash('Note uploaded successfully!')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid file type!')
            return redirect(url_for('upload_notes'))
    return render_template('upload-notes.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        profile_pic = request.files.get('profilePicture')
        profile_pic_filename = None
        if profile_pic and profile_pic.filename:
            pic_filename = secure_filename(profile_pic.filename)
            profile_pic.save(os.path.join(app.config['UPLOAD_FOLDER'], pic_filename))
            profile_pic_filename = pic_filename
        if User.query.filter((User.username == username) | (User.email == email)).first():
            flash('Username or email already exists!')
            return redirect(url_for('register'))
        hashed_pw = generate_password_hash(password)
        user = User(username=username, email=email, password=hashed_pw, profile_pic=profile_pic_filename)
        db.session.add(user)
        db.session.commit()
        return render_template('register_success.html', username=username)
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('dashboard'))
        flash('Invalid username or password!')
        return redirect(url_for('login'))
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    uploads_count = Note.query.filter_by(uploader_id=current_user.id).count()
    downloads_count = 0  # Placeholder, as downloads are not tracked yet
    avg_rating = 0       # Placeholder, as ratings are not tracked yet
    return render_template(
        'dashboard.html',
        uploads_count=uploads_count,
        downloads_count=downloads_count,
        avg_rating=avg_rating
    )

@app.route('/upload', methods=['GET', 'POST'])
@login_required
def upload():
    if request.method == 'POST':
        title = request.form['title']
        course = request.form['course']
        semester = request.form['semester']
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            note = Note(title=title, course=course, semester=semester, filename=filename, uploader_id=current_user.id)
            db.session.add(note)
            db.session.commit()
            flash('Note uploaded successfully!')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid file type!')
            return redirect(url_for('upload'))
    return render_template('upload.html')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/ask-question', methods=['POST'])
@login_required
def ask_question():
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        
        question = Question(
            title=title,
            content=content,
            author_id=current_user.id
        )
        
        db.session.add(question)
        db.session.commit()
        
        flash('Your question has been posted successfully!', 'success')
        return redirect(url_for('forum'))

def create_admin_user():
    admin_username = "admin"
    admin_email = "admin@fastparhai.com"
    admin_password = "admin123"  # Change for production!
    admin = User.query.filter_by(username=admin_username).first()
    if not admin:
        hashed_pw = generate_password_hash(admin_password)
        admin = User(username=admin_username, email=admin_email, password=hashed_pw, is_admin=True)
        db.session.add(admin)
        db.session.commit()
        print("Admin user created: username=admin, password=admin123")
    else:
        print("Admin user already exists.")

@app.errorhandler(403)
def forbidden_error(error):
    return render_template('403.html'), 403

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        create_admin_user()
    app.run(host='0.0.0.0', port=8080) 