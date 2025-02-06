from flask import Blueprint, render_template

# Criando um Blueprint
main = Blueprint('main', __name__)

@main.route('/')
def home():
    return render_template('index.html')
