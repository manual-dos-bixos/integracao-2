$(document).ready(function() {
    $('body').css('overflow', 'hidden');
    $('#index').show();
    $('section').css({'transform': 'translateY(0)', 'transition': 'all 1.5s cubic-bezier(.5,0,0,1)'});

    maiorQuantAlunos = $('.tema-lista:first').find('.tema-quant-alunos').val();
    $('.tema-lista').each(function() {
        quantAlunos = $(this).find('.tema-quant-alunos').val();
        $(this).find('.quant-alunos-bar').css({'width': (quantAlunos / maiorQuantAlunos) * 100 + '%'});
        if ($(this).index() > 5) $(this).slideUp(0);
    });
});

$(document).on('click', '#ver-todos-temas', function() {
    if ($(this).hasClass('toggled')) {
        $('.tema-lista:gt(5)').slideUp(200);
    } else {
        $('.tema-lista').slideDown(200);
    }
    
    $(this).find('.bi').toggleClass('bi-caret-up-fill');
    $(this).toggleClass('toggled');
});

$(document).on('click', '#scroll-to-main', function() {
    $('body').css({'overflow': 'scroll'});
    $('section').css({'transform': 'translateY(-100vh)'});
});

window.addEventListener('scroll', function() {
    if (window.scrollY >= window.innerHeight) {
        $('#index').hide()
        $('body').css({'overflow': 'scroll'});
    }
});

$(document).on('click', '#manual-btn, #link-inscricao', function(e) {
    e.preventDefault();

    $("#main").fadeOut(200);
    $("#acesso-manual").fadeIn(200);
});

$(document).on('click', '#adocao-btn', function() {
    $("#main").fadeOut(200);
    $("#projeto-adocao").fadeIn(200);
});

$(document).on('keyup', '#email', function() {
    $('#email').siblings('span').text('');
    $('#email').siblings('span').slideUp(100);
});

$(document).on('click', '#btn-acessar-manual', function() {
    hasFilledForm($('#email').val());
});

$(document).on('click', '.link-index', function() {
    $("#main").fadeIn(200);
    $("#acesso-manual").fadeOut(200);
    $("#projeto-adocao").fadeOut(200);
});

$(document).on('click', '.link-adocao', function() {
    $('#modal-email-sem-cadastro').modal('hide');
    $("#acesso-manual").fadeOut(200);
    
    $("#form-calouros").fadeOut(200);
    $("#form-veteranos").fadeOut(200);
    
    setTimeout(function() {
        $("#projeto-adocao").fadeIn(200);
        $("svg").fadeIn(200);
    }, 200);
});

$(document).on('click', '.btn-tipo-aluno', function() {
    $('.btn-tipo-aluno').not(this).removeClass('selected-btn');
    
    $(this).toggleClass('selected-btn');

    if ($(this).attr('id') == 'btn-calouro' && $(this).hasClass('selected-btn')) {
        $('#tipo-aluno').val(1);
    } else if ($(this).attr('id') == 'btn-veterano' && $(this).hasClass('selected-btn')) {
        $('#tipo-aluno').val(2);
    } else {
        $('#tipo-aluno').val(0);
    }

    $('#form-email').slideDown(200);
});

function hasFilledForm(email) {
    let emailValido = validacaoEmail(email);

    if (emailValido) {
        $( "#btn-acessar-manual span" ).fadeOut(200)
        setTimeout(function() {
            $( "#btn-acessar-manual" ).addClass("loading-btn");
        }, 200);

        const url = 'https://docs.google.com/spreadsheets/d/14HkIJpVn2TV9gcAjpiXDE0uu0kEBzevZn2L1ErgsKFY/export?format=csv&id=14HkIJpVn2TV9gcAjpiXDE0uu0kEBzevZn2L1ErgsKFY&gid=934437593';
        
        fetch(url)
        .then(data => data.text())
        .then(data => {
            let calouros = csvToJson(data);
            
            let found = false;
            calouros.forEach(calouro => {
                if (calouro.email == email) found = true;
            });

            if (found) window.location.href = 'manual-dos-bixos.html';
            else $('#modal-email-sem-cadastro').modal('show');
        })
        .catch(error => function() {
            console.error(error);
        })
        .finally(function() {
            $("#btn-acessar-manual").removeClass("loading-btn");
            setTimeout(function() {
                $("#btn-acessar-manual span").fadeIn(200);
            }, 200)
        });
    } else {
        $('#email').siblings('span').text('Insira um endereço de email válido.');
        $('#email').siblings('span').slideDown(100);
    }

}

function csvToJson(csv) {
    const lines = csv.split('\n');

    const headers = lines[0].split(',');

    const resultado = lines.slice(1).map(line => {
        const columns = line.split(',')
        const obj = {};

        headers.forEach((header, index) => {
            header = header.replace('\r', '');
            obj[header] = columns[index].replace(/&#44;/g, ",");
        });
        return obj;
    });

    return resultado;
}

function validacaoEmail(email) {
    usuario = email.slice(0, email.indexOf("@"));
    dominio = email.slice(email.indexOf("@") + 1, email.length);
    
    return (
        (usuario.length >=1) &&
        (dominio.length >=3) &&
        (usuario.search("@")==-1) &&
        (dominio.search("@")==-1) &&
        (usuario.search(" ")==-1) &&
        (dominio.search(" ")==-1) &&
        (dominio.search(".")!=-1) &&
        (dominio.indexOf(".") >=1)&&
        (dominio.lastIndexOf(".") < dominio.length - 1)
    )
}