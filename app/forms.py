from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, RadioField, TextAreaField
from wtforms.validators import DataRequired, Length, NumberRange

class FormularioCadastro(FlaskForm):
    nome = StringField(
        'Nome',
        validators = [DataRequired()],
        render_kw = {
            'class': 'btn btn-dark form-control',
            'required': 'true',
            'minlength': 3
        }
    )

    sobrenome = StringField(
        'Sobrenome',
        validators = [DataRequired()],
        render_kw = {
            'class': 'btn btn-dark form-control',
            'required': 'true',
            'minlength': 3
        }
    )

    idade = IntegerField(
        'Idade',
        validators = [DataRequired()],
        render_kw = {
            'class': 'btn btn-dark form-control text-center',
            'inputmode': 'numeric',
            'required': 'true'
        }
    )
    
    whatsapp = StringField(
        'WhatsApp',
        validators = [DataRequired()],
        render_kw = {
            'class': 'btn btn-dark form-control text-center telefone-input',
            'inputmode': 'numeric',
            'required': 'true',
            'placeholder': '(xx) x xxxx-xxxx',
            'minlength': 12
        }
    )

    semestre_atual = IntegerField(
        'Semestre Atual',
        validators = [DataRequired(), NumberRange(min=1, max=10)],
        render_kw = {
            'class': 'btn btn-dark form-control text-center',
            'inputmode': 'numeric',
            'required': 'true'
        }
    )

    curso = IntegerField(
        'Curso',
        validators = [DataRequired()],
        render_kw = {
            'class': 'form-check d-none',
            'required': 'true'
        }
        # choices = [
        #     (1, 'Análise e Desenvolvimento de Sistemas (MANHÃ)'),
        #     (2, 'Análise e Desenvolvimento de Sistemas (TARDE)'),
        #     (3, 'Gestão da Tecnologia da Informação (NOITE)'),
        #     (4, 'Gestão de Energia e Eficiência Energética (NOITE)'),
        #     (5, 'Gestão Empresarial (MANHÃ)'),
        #     (6, 'Logística (NOITE)'),
        #     (7, 'Processos Químicos (MANHÃ)'),
        #     (8, 'Processos Químicos (NOITE)')
        # ]
    )

    sobre = TextAreaField(
        'Nos conte um pouco sobre você!',
        validators = [DataRequired()],
        render_kw = {
            'class': 'btn btn-dark form-control',
            'placeholder': 'Esta informação é para ajudar o seu calouro/veterano a te conhecer um pouco melhor. Conte um pouco sobre suas experiências pessoais e acadêmicas, hobbies e temaes.',
            'rows': 8,
            'required': 'true'
        }
    )