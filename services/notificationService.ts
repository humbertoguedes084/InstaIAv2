
export class NotificationService {
  private static ADMIN_EMAIL = 'humbertoguedesdev@gmail.com';

  /**
   * Envia uma notificação de novo usuário para o administrador.
   * Utiliza o Formspree como relay gratuito e confiável para e-mail via frontend.
   */
  static async sendAdminNotification(userData: { name: string; email: string }) {
    try {
      // Usando o endpoint de integração direta do Formspree (substitua pelo seu ID se desejar persistência no painel deles)
      // Por padrão, o Formspree permite enviar para o e-mail configurado na conta.
      const response = await fetch('https://formspree.io/f/mqakpzzq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          subject: '🚀 NOVO CADASTRO: Insta.IA Marketing Pro',
          admin_target: this.ADMIN_EMAIL,
          message: `Um novo usuário acaba de se cadastrar na plataforma!`,
          user_name: userData.name,
          user_email: userData.email,
          timestamp: new Date().toLocaleString('pt-BR'),
          action: 'Verifique o painel administrativo para aprovação.'
        })
      });

      if (!response.ok) {
        console.warn('Falha silenciosa na notificação de admin.');
      }
    } catch (error) {
      console.error('Erro ao enviar alerta de admin:', error);
    }
  }
}
