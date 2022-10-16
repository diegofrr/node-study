// metodos: index, show, update, store, destroy

/*
index => listar sessões
store: criar sessão
show: lista ÚNICA sessão
update: atualizar sessão
destroy: deletar sessão
*/

export default new class SessionControler {
    store(request, response) {
        return response.json({message: 'my api!'})
    }
}