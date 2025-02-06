$(document).ready(function() {
    $('#btn-next, #btn-prev').hide();
    $('.step-icon').first().css({'background-color': '#641290', 'color': '#fff'});
});

$(document).on('keydown', 'input', function(e) {
    if (e.key == 'Tab' || e.key == 'Enter') e.preventDefault();
});

$(document).on('click', '.btn-curso', function(e) {
    e.preventDefault();
    let cursoId = $(this).data('codigo');

    $('.btn-curso').removeClass('btn-curso-ativo');
    $(this).addClass('btn-curso-ativo');

    $('#curso').val(cursoId);
});

$(document).on('click', '#btn-prev, #btn-next', function(e) {
    let numEtapas = $('.form-section').length;
    let sectionAtual = $('.section-atual');

    if ($(this).prop('id') == 'btn-next') {
        let inputs = $('.section-atual').find('input, textarea');
        let etapaCompleta = validateForm(inputs);
    
        if (etapaCompleta) {
            let nextSection = sectionAtual.next();
            
            sectionAtual.removeClass('section-atual').css('left', '-100%');
            nextSection.addClass('section-atual').css('left', '0');
            
            $('#btn-prev').removeClass('disabled');
            if ($('.form-section.section-atual').index() == numEtapas - 1) $(this).addClass('disabled');
        } else {
            $('#warning-campos-incompletos').css({'top': '0'});
            setTimeout(() => $('#warning-campos-incompletos').css({'top': '-30vh'}), 2000);
        }
    } else {
        let prevSection = sectionAtual.prev();
        sectionAtual.removeClass('section-atual').css('left', '100%');
        prevSection.addClass('section-atual').css('left', '0');

        $('#btn-next').removeClass('disabled');
        if (prevSection.is('.form-section:first-child')) $(this).addClass('disabled');
    }

    let etapaAtual = $('.section-atual').index();
    $('#form-progress-bar .progress').css({'width': (etapaAtual / (numEtapas - 1) * $('#form-progress-bar').width()) + 'px'});
    $('.step-icon').slice(0, etapaAtual + 1).css({'background-color': '#641290', 'color': '#fff'})
    $('.step-icon').slice(etapaAtual + 1).css({'background-color': '#fff', 'color': '#641290'})
});

$(document).on('keydown change', '.is-invalid', function(e) {
    $(this).removeClass('is-invalid');
    $(this).parent().find('.error-span').remove();
});

$(document).on('click', '.btn-tipo-aluno-inscricao', function(e) {
    e.preventDefault();
    $('.btn-tipo-aluno-inscricao').removeClass('selected-btn');
    $(this).addClass('selected-btn');

    if ($('#btn-next').is(':hidden')) setTimeout(() => $('#btn-next').click(), 600);
    $('#btn-next, #btn-prev').prop('hidden', false);
    $('#btn-next, #btn-prev').fadeIn(100);

    if ($(this).data('tipo') == 'calouro') {
        $('#semestre_atual').parent().hide();
        $('#semestre_atual').val('1');
    } else {
        $('#semestre_atual').parent().show();
        $('#semestre_atual').val('');
    }
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

$(document).on('click', '.tema', function(e) {
    let temaId = $(this).data('codigo');
    $(this).toggleClass('tema-selecionado');

    if ($(this).hasClass('tema-selecionado')) {
        let interesses = $('#temas').val() ? $('#temas').val() + ',' : '';
        $('#temas').val(interesses + $(this).data('codigo'));
    } else {
        let interesses = $('#temas').val();
        interesses = interesses.replace(temaId + ',', '').replace(',' + temaId, '');
        $('#temas').val(interesses);
    }
    console.log($('#temas').val());
});

$(document).on('keydown', '#novo-tema', function(e) {
    if (e.key === 'Enter') {        
        $('#lista-temas-novos').append(`<span class="tema-adicionado">${$(this).val()}<i class="bi bi-x-lg ms-2"></i></span>`);
        $(this).val('');
        $(this).focus();
    }
});

$(document).on('click', '.tema-adicionado .bi-x-lg', function(e) {
    $(this).parent().remove();
});

$(document).on('click', '.close-warning', function() {
    $(this).closest('.warning').css({'top': '-30vh'});
});

$(document).on('click', '#btn-enviar-form', function(e) {
    e.preventDefault();

    let inputs = $('.section-atual').find('input, textarea');
    let etapaCompleta = validateForm(inputs);

    if (etapaCompleta) {
        $('#form-adocao').submit();
    } else {
        $('#warning-campos-incompletos').css({'top': '0'});
        setTimeout(() => $('#warning-campos-incompletos').css({'top': '-30vh'}), 2000);
    }
});

function validateForm(inputs) {
    let valido = true;
    
    inputs.not('#csrf_token').each(function() {
        let input = $(this);
        input.parent().find('.error-span').remove();
        
        let value = input.val().trim();
        let maxlen = input.attr('maxlength');
        let minlen = input.attr('minlength');
        let max = parseFloat(input.attr('max'));
        let min = parseFloat(input.attr('min'));
        
        let empty = input.prop('required') == true && value == '';
        let tooShort = !isNaN(parseFloat(minlen)) && minlen > 0 && value.length < minlen;
        let tooLong = !isNaN(parseFloat(maxlen)) && maxlen > 0 && value.length > maxlen;
        let tooBig = !isNaN(parseFloat(max)) && max > 0 && parseFloat(value) > max;
        let tooSmall = !isNaN(parseFloat(min)) && min > 0 && parseFloat(value) < min;

        if (empty || tooLong || tooShort || tooBig || tooSmall) {
            input.addClass('is-invalid');
            valido = false;
        }

        if (tooLong) input.parent().append(`<small class="text-danger error-span">Máximo de ${maxlen} caracteres.</small>`);
        if (tooShort) input.parent().append(`<small class="text-danger error-span">Mínimo de ${minlen} caracteres.</small>`);
        if (tooBig) input.parent().append(`<small class="text-danger error-span">Valor maior que ${max}.</small>`);
        if (tooSmall) input.parent().append(`<small class="text-danger error-span">Valor menor que ${min}.</small>`);
    });
    
    return valido;
}