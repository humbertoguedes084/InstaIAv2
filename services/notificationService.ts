
export class NotificationService {
  private static ADMIN_EMAIL = 'humbertoguedesdev@gmail.com';

  /**
   * Envia uma notificação de alta prioridade para o administrador.
   * Configurado para disparar um alerta visualmente rico no e-mail do admin.
   */
  static async sendAdminNotification(userData: { name: string; email: string }) {
    try {
      // Usando o endpoint Formspree configurado pelo usuário
      const response = await fetch('https://formspree.io/f/mqakpzzq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `🚀 NOVO CADASTRO: ${userData.name.toUpperCase()}`,
          _to: this.ADMIN_EMAIL,
          prioridade: 'URGENTE',
          origem: 'Insta.IA Marketing Pro - Onboarding',
          mensagem: `Um novo usuário acaba de solicitar acesso ao estúdio de renderização.`,
          dados_do_lead: {
            nome: userData.name,
            email: userData.email,
            plataforma: 'Insta.IA Marketing Pro',
            data_hora: new Date().toLocaleString('pt-BR')
          },
          proximo_passo: 'Acesse a "Torre de Comando" para validar os créditos deste usuário.',
          painel_admin: 'https://insta-ia-marketing-pro.vercel.app/admin'
        })
      });

      if (!response.ok) {
        console.warn('Alerta Admin: Formspree retornou erro. Verifique a quota ou conexão.');
      }
    } catch (error) {
      console.error('Erro ao disparar alerta de administrador:', error);
    }
  }

  /**
   * Mock para e-mails de marketing/confirmação direta
   */
  static async sendUserWelcome(userEmail: string) {
    console.log(`Pipeline de boas-vindas iniciado para: ${userEmail}`);
  }
}
