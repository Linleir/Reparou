document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede que a página recarregue
            
            // Vai buscar os valores digitados
            const documentoBruto = document.getElementById('login-documento').value;
            // Remove pontos, traços e barras para comparar apenas os números
            const documento = documentoBruto.replace(/\D/g, ''); 
            const senha = document.getElementById('login-senha').value;
            const erroMsg = document.getElementById('login-erro');

            if (!documento || !senha) {
                erroMsg.textContent = "Por favor, preencha o login e a palavra-passe.";
                return;
            }

            // 1. TENTA FAZER LOGIN COMO ADMINISTRADOR
            if (typeof administradores !== 'undefined') {
                const admin = administradores.find(a => a.id === documento && a.senha === senha);
                if (admin) {
                    localStorage.setItem('adminLogado', admin.id);
                    localStorage.setItem('tipoUsuarioLogado', 'admin');
                    window.location.href = 'admin.html';
                    return;
                }
            }

            // 2. TENTA FAZER LOGIN COMO LOJISTA
            if (typeof lojistas !== 'undefined') {
                const lojista = lojistas.find(l => l.cnpjNumeros === documento && l.senha === senha);
                if (lojista) {
                    localStorage.setItem('lojistaLogado', lojista.id); 
                    localStorage.setItem('tipoUsuarioLogado', 'lojista');
                    window.location.href = 'perfil_lojista.html';
                    return;
                }
            }

            // 3. TENTA FAZER LOGIN COMO CLIENTE
            if (typeof clientes !== 'undefined') {
                const cliente = clientes.find(c => c.id === documento && c.senha === senha);
                if (cliente) {
                    localStorage.setItem('clienteLogado', cliente.id);
                    localStorage.setItem('tipoUsuarioLogado', 'cliente');
                    window.location.href = 'inicio_cliente.html';
                    return;
                }
            }

            // Se não encontrar correspondência em nenhum dos 3 perfis
            erroMsg.textContent = "Credenciais inválidas. Verifique o documento e a palavra-passe.";
        });
    }
});