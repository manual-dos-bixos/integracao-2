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
    $('#index').css({'transform': 'translateY(-100vh)', 'height': 0});
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
    hasFilledForm($('#whatsapp-acesso-manual').val());
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

// FORMATAR TELEFONE
$(document).on('input', '.telefone-input', function() {
    var value = $(this).val().replace(/\D/g, '');
        
    if (value.length <= 2) {
        $(this).val(`(${value}`);
    } else if (value.length <= 6) {
        $(this).val(`(${value.slice(0, 2)}) ${value.slice(2, 6)}`);
    } else if (value.length <= 10) {
        $(this).val(`(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6, 12)}`);
    } else {
        $(this).val(`(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3, 7)}-${value.slice(7, 11)}`);
    }
});
// Permite apagar os caracteres nao numericos
$(document).on('keydown', '.telefone-input', function(e) {
    var value = $(this).val().replace(/\D/g, '');

    if (e.keyCode === 8) $(this).val(value);
});

$(document).on('click', '#acessar-admin-btn', function() {
    $('#modal-acesso-admin').modal('show');
});
$(document).on('submit', '#form-acessar-admin', function(e) {
    e.preventDefault();
    $('.error').slideUp(100, function() {
        $('.error').remove();
    });

    $.ajax({
        url: '/admin',
        type: 'POST',
        data: {'admin_pw_input': $('#admin-pw-input').val()},
        success: function(response) {
            if (response == 0) {
                $('#admin-pw-input').after('<span class="text-danger error" hidden>Senha inválida.</span>');
                $('.error').slideDown();
            }
        },
        catch: function(error) {
            console.log(error);
        }
    });
    $('#modal-acesso-admin').modal('show');
});

function hasFilledForm(whatsapp) {
    let data = {'whatsapp': whatsapp, 'tipo_aluno': ($('#tipo-aluno').val() == 1 ? 'calouro' : 'veterano')};
    console.log(data);

    $.ajax({
        url: '/conferir_whatsapp_inscricao',
        type: 'GET',
        data: data,
        success: function(response) {
            if (response == 1) {
                window.location = '/manual';
            } else {
                $('#modal-email-sem-cadastro').modal('show');
            }
        },
        catch: function(error) {
            console.log(error);
        }
    });
}


