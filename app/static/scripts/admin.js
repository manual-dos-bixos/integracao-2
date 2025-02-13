$(document).ready(function() {
    carregarAlunos();
    updateTabelas();
});

$(document).on('change', '#select-curso-id', function() {
    let cursoSelcionado = $('#select-curso-id').val();
    
    carregarAlunos(cursoSelcionado);
    
    $('#select-calouro-id, #select-veterano-id').find('option:selected').each(function() {
        if ($(this).data('curso') != cursoSelcionado) $(this).parent().val('');
    });
});

$(document).on('submit', '#form-criar-adocao', function() {
    e.preventDefault();
    $.ajax({
        url: '/add_adocao',
        type: 'POST',
        data: $(this).serialize(),
        success: function(response) {
            if (response == 1) {
                $('#warning-sucesso').css({'top': '0'});
                setTimeout(() => $('#warning-sucesso').css({'top': '-30vh'}), 2000);
                
                $('#select-curso-id').val('').change();

                $('#select-calouro-id').html('<option value="">Selecione</option>');
                $('#select-veterano-id').html('<option value="">Selecione</option>');

                $('#select-calouro-id').prop('disabled', true)
                $('#select-veterano-id').prop('disabled', true)
            } else {
                $('#warning-erro').css({'top': '0'});
                setTimeout(() => $('#warning-erro').css({'top': '-30vh'}), 2000);
            }
        },
        catch: function(error) {
            $('#warning-erro').css({'top': '0'});
            setTimeout(() => $('#warning-erro').css({'top': '-30vh'}), 2000);
            console.log(error);
        }
    });
});

function carregarAlunos(curso = null) {
    let data = curso ? { 'curso': curso } : {};

    $.ajax({
        url: '/get_alunos_sem_adocao',
        type: 'GET',
        data: data,
        success: function(response) {
            $('#select-calouro-id').html('<option value="">Selecione</option>');
            $('#select-veterano-id').html('<option value="">Selecione</option>');

            if (curso) {
                $('#select-calouro-id').prop('disabled', false)
                $('#select-veterano-id').prop('disabled', false)
            }

            response.veteranos.forEach(aluno => {
                $('#select-veterano-id').append(`<option value="${aluno.id}" data-curso="${aluno.curso}">${aluno.nome} ${aluno.sobrenome}</option>`)
            });
            response.calouros.forEach(aluno => {
                $('#select-calouro-id').append(`<option value="${aluno.id}" data-curso="${aluno.curso}">${aluno.nome} ${aluno.sobrenome}</option>`)
            });

            $('#quant-alunos tbody').html('');
            Object.values(response.quant_alunos).forEach(curso => {
                $('#quant-alunos tbody').append(
                    `<tr>
                        <td class="col-3">${curso.nome}</td>
                        <td class="col-3 text-center">${curso.vet}</td>
                        <td class="col-3 text-center">${curso.cal}</td>
                        <td class="col-3 text-center"><i class="bi ${(curso.vet > 0 && curso.cal > 0) ? 'bi-check-square-fill text-success' : 'bi-square text-danger'}"></i></td>
                    </tr>`
                );
            })

            updateTabelas();
        },
        catch: function(error) {
            $('#warning-erro').css({'top': '0'});
            setTimeout(() => $('#warning-erro').css({'top': '-30vh'}), 2000);
            console.log(error);
        }
    });
}

function updateTabelas() {
    $.ajax({
        url: '/get_tabelas',
        type: 'GET',
        success: function(response) {
            $('#collapseCalouros').find('.table tbody').html('')
            $('#collapseVeteranos').find('.table tbody').html('')
            $('#collapseAdocoes').find('.table tbody').html('')

            response.calouros.forEach(calouro => {
                $('#collapseCalouros').find('.table tbody').append(
                    `<tr>
                        <td class="id">${calouro.id}</td>
                        <td class="nome">${calouro.nome}</td>
                        <td class="sobrenome">${calouro.sobrenome}</td>
                        <td class="idade">${calouro.idade}</td>
                        <td hidden class="whatsapp">${calouro.whatsapp}</td>
                        <td hidden class="semestre">${calouro.semestre}</td>
                        <td hidden class="sobre">${calouro.sobre}</td>
                        <td class="curso">${calouro.curso})</small></td>
                    </tr>`
                );
            });

            response.veteranos.forEach(veterano => {
                $('#collapseVeteranos').find('.table tbody').append(
                    `<tr>
                        <td class="id">${veterano.id}</td>
                        <td class="nome">${veterano.nome}</td>
                        <td class="sobrenome">${veterano.sobrenome}</td>
                        <td class="idade">${veterano.idade}</td>
                        <td hidden class="whatsapp">${veterano.whatsapp}</td>
                        <td hidden class="sobre">${veterano.sobre}</td>
                        <td class="curso">${veterano.curso})</small></td>
                        <td class="semestre">${veterano.semestre}</td>
                    </tr>`
                );
            });

            response.adocoes.forEach(adocao => {
                $('#collapseAdocoes').find('.table tbody').append(
                    `<tr>
                        <td class="data">${adocao.id}</td>
                        <td class="curso text-center">${adocao.curso}</td>
                        <td class="notificados text-center fs-3"><i class="bi ${adocao.notificados == true ? 'bi-check-square-fill text-success' : 'bi-square text-danger'}"></i></td>
                        <td class="calouro">${adocao.calouro}<br><small class="text-secondary">${adocao.calouro_sobre}</small></td>
                        <td class="calouro_wpp">${adocao.calouro_wpp}</td>
                        <td class="veterano">${adocao.veterano}<br><small class="text-secondary">${adocao.veterano_sobre}</small></td>
                        <td class="veterano_wpp">${adocao.veterano_wpp}</td>
                    </tr>`
                );
            });
        },
        catch: function(error) {
            console.log(error);
        }
    });
}