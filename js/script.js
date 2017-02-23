var server = "http://192.168.1.168:3000/product/";//servidos com os dados

function clearTable(){//limpa a tabela
	$("#rowsTable").html("");
}

function createTable(){//cria a tabela através do get
	var statusSelected = checkStatusSelect($("#selectStatus").val());
	clearTable();//limpa a tabela para atualizar
	$.get(server, function(data) {//seleciona os dados no json
		for(var i=0; i<data.length; i++){//percorre todos os dados
			var valor = valueToString(data[i].valor);
			var status = verifyStatus(data[i].status);
			if(statusSelected==data[i].status){
				$("#rowsTable").append("<tr data-id="+data[i].id+" >"+//cria a linha da tabela com os dados
				"<td>"+data[i].id+"</td>"+
				"<td>"+data[i].nome+"</td>"+
				"<td>R$ "+valor+"</td>"+
				"<td>"+status+"</td>"+//printa o parametro mandado pelo checkStatus
				"<td>"+data[i].estoque+"</td>"+
				"<td class='table-option'><button data-toggle='modal' data-target='#dataModal' class='editBtn'><span class='glyphicon glyphicon-pencil'></span></button></td>"+
				"<td class='table-option'><button data-toggle='modal' data-target='#deleteModal' class='delBtn'><span class='glyphicon glyphicon-trash'></span></button></td></tr>");
			}
			else if(statusSelected==""){
				$("#rowsTable").append("<tr data-id="+data[i].id+" >"+//cria a linha da tabela com os dados
				"<td>"+data[i].id+"</td>"+
				"<td>"+data[i].nome+"</td>"+
				"<td>R$ "+valor+"</td>"+
				"<td>"+status+"</td>"+//printa o parametro mandado pelo checkStatus
				"<td>"+data[i].estoque+"</td>"+
				"<td class='table-option'><button data-toggle='modal' data-target='#dataModal' class='editBtn'><span class='glyphicon glyphicon-pencil'></span></button></td>"+
				"<td class='table-option'><button data-toggle='modal' data-target='#deleteModal' class='delBtn'><span class='glyphicon glyphicon-trash'></span></button></td></tr>");

			}
		}
	});
}

function verifyStatus(statusJson){
	if (statusJson=="A"){
		var status="Ativo";
		return status;
	}
	else if (statusJson=="I"){
		var status="Inativo";
		return status;
	}
}

function checkStatusSelect(statusSelected){
	if (statusSelected=="A" || statusSelected=="I"){
		return statusSelected;
	}
	else if (statusSelected=="AI"){
		return "";
	}
}


function valueToString(valor){//transforma o valor de numero para string para colocar na tabela e no modal
	valor = parseFloat(valor.toString()).toFixed(2).replace(".", ",");
	return valor;
}

function valueToNumber(){//transforma o valor de string para numero, para adicionar no json
	var valor = $("#valor").val();
	valor = Number(valor.replace(",", "."));
	return valor;
}

function inputsModalAdd(){//limpa as inputs do modal antes de começar a adicionar
	$("#nome, #valor, #estoque").val("");
	$("#status").val("A");
	$("#saveBtn").data('item', "");//define o botão de salvar com o id nulo
}

function setIdModalEdit(id){
	$("#dataModal").data('item', id);//define o modal com o id do produto
	$("#saveBtn").data('item', id);//define o botão save com o id do produto
}

function inputsModalEdit(id){//preenche os inputs do modal editar
	$.get(server+id, function(data) {//chama os produtos para preencher as inputs com o produto certo
		$("#nome").val(data.nome);
		$("#valor").val(valueToString(data.valor));
		$("#status").val(data.status);
		$("#estoque").val(data.estoque);
	});
}

function setIdModalDel(id){
	$("#deleteModal").data('item', id);//define o modal com o id do produto
}

function deleteJson(id){//manda os dados para realizar a operação de deletar
	ajax("DELETE", id, "", "", "", "", "Item excluído com sucesso!");
}

function addJson(){//manda os dados para realizar a operação de adicionar
	ajax("POST", "", $("#nome").val(), valueToNumber(), $("#status").val(), $("#estoque").val(), $("#nome").val()+" adicionado com sucesso!");
}

function editJson(id){//manda os dados para realizar a operação de editar
	ajax("PUT", id, $("#nome").val(), valueToNumber(), $("#status").val(), $("#estoque").val(), "Item editado com sucesso!");
}

function ajax(type, id, nome, valor, status, estoque, msg){//realiza a operação desejada, com os dados recebidos
	$.ajax({
		type: type,
		url: server+id,
		data: {
			nome: nome,
			valor: valor,
			status: status,
			estoque: estoque
		},
		success: function(){
			alertMsg(msg);//envia mensagem conforme função realizada
			createTable();//chama a tabela atualizada
		}
	});
}

function alertMsg(mensagem){//cria um alert depois das operações
	$("#msgAlert").html("<div class='alert alert-success alert-dismissible' id='alert'><a class='close'data-dismiss='alert' aria-label='close'>&times;</a>"+
		"<p>"+mensagem+"</p></div>");
	$('#alert').fadeOut(5000);
}

//seleciona o id na tabela através dos botões de editar e deletar
function getId(){
	$("#rowsTable").on('click', '.delBtn', function(){//no clique do botão deletar na tabela, pega o id da linha
		var id = $(this).parents('tr').data('id');
		setIdModalDel(id);//seta o id da linha no modal de deletar
	});
	$("#rowsTable").on('click', '.editBtn', function(){//no clique do botão editar na tabela, pega o id da linha
		var id = $(this).parents('tr').data('id');
		setIdModalEdit(id);//seta o id da linha no modal de edição
		inputsModalEdit(id);//preenche os inputs no modal de edição
	});
}

function modalTitles(title, button){
	$("#titleModal").html(title);//cria o título do modal editar/adicionar
	$("#saveBtn").val(button);//cria o titulo do botão de salvar
}

function checkSave(saveId){
	if (saveId == ""){//se o id for vazio, é pra adicionar
		addJson();
	}else{//se o id não for vazio, é pra editar
		editJson(saveId);
	}
}

function actions(){//ações dos botões
	$("#addBtn").click(function(){
		modalTitles("Adicionando Produto", "Adicionar Produto");//clica para adicionar o produto, muda o título do modal
		inputsModalAdd();//limpa as inputs do modal
	});
	$("#rowsTable").on('click', '.editBtn', function(){
		modalTitles("Editando Produto", "Salvar Alterações");//clica para editar o produto, muda o título do modal
	});
	$('#selectStatus').change(function(){//quando muda a opção do select
		createTable();//checa qual status está selecionado
	});
	$("#deleteBtn").click(function(){//clique no botão delete do modal e pega o id do produto
		deleteJson($("#deleteModal").data('item'));//confirma a operação de deletar
	});
	$("#saveBtn").click(function(){//clica para salvar
		checkSave($("#saveBtn").data('item'));//check se é para adicionar ou editar
	});
}

//mascara para o campo valor do modal
function maskMoney(){
	$('#valor').priceFormat({
	prefix: '',
    centsSeparator: ',',
    thousandsSeparator: ''
});
}

$(document).ready(function(){
	createTable();//cria a tabela com o $.get
	actions();//ações de botões 
	getId();//seleciona o id na tabela através dos botões de editar e deletar
	maskMoney();//mascara para o valor
	// checkStatus($("#selectStatus").val());
});
