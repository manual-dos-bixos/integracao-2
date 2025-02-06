from flask import Flask
from . import db
from flask_sqlalchemy import SQLAlchemy


class Aluno(db.Model):
    __tablename__ = 'aluno'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    sobrenome = db.Column(db.String(255), nullable=False)
    idade = db.Column(db.Integer, nullable=False)
    whatsapp = db.Column(db.String(20), nullable=False)
    semestre = db.Column(db.SmallInteger)
    sobre = db.Column(db.Text)
    curso_id = db.Column(db.Integer, db.ForeignKey('curso.id'), nullable=False)
    
    curso = db.relationship('Curso', backref='alunos')

    def __init__(self, nome, sobrenome, idade, whatsapp, semestre, sobre, curso_id):
        self.nome = nome
        self.sobrenome = sobrenome
        self.idade = idade
        self.whatsapp = whatsapp
        self.semestre = semestre
        self.sobre = sobre
        self.curso_id = curso_id

class Curso(db.Model):
    __tablename__ = 'curso'
    id = db.Column(db.Integer, primary_key=True)
    sigla = db.Column(db.String(10), nullable=False)
    nome = db.Column(db.String(255), nullable=False)
    turno = db.Column(db.String(10), nullable=False)

class Tema(db.Model):
    __tablename__ = 'tema'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    descricao = db.Column(db.String(255), nullable=False)

class AlunoTema(db.Model):
    __tablename__ = 'aluno_tema'
    id = db.Column(db.Integer, primary_key=True)
    aluno_id = db.Column(db.Integer, db.ForeignKey('aluno.id'), nullable=False)
    tema_id = db.Column(db.Integer, db.ForeignKey('tema.id'), nullable=False)
    
    aluno = db.relationship('Aluno', backref='alunoTema')
    tema = db.relationship('Tema', backref='alunoTema')
    
    def __init__(self, aluno_id, tema_id):
        self.aluno_id = aluno_id
        self.tema_id = tema_id
