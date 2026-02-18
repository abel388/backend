import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendPasswordReset(to: string, token: string) {
    const frontend = process.env.FRONTEND_URL || process.env.NEXTAUTH_URL || 'https://next-front-xtv9.vercel.app';
    const resetLink = `${frontend.replace(/\/$/, '')}/auth/reset-password?token=${token}`;




    // En desarrollo, solo logea el email en consola
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Email de recuperación (modo desarrollo):');
      console.log(`   Para: ${to}`);
      console.log(`   Token: ${token}`);
      console.log(`   Link: ${resetLink}`);
      return;
    }

    // En producción, envía el email
    try {
      await this.transporter.sendMail({
        from: `"Equipo de Soporte" <${this.configService.get('MAIL_USER')}>`,
        to,
        subject: 'Recuperación de Contraseña',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e293b;">Recuperación de Contraseña</h2>
            <p>Has solicitado restablecer tu contraseña.</p>
            <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${resetLink}" style="background-color: #1e293b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Restablecer Contraseña
              </a>
            </div>
            <p style="color: #64748b; font-size: 14px;">O copia y pega este enlace en tu navegador:</p>
            <p style="color: #3b82f6; font-size: 14px; word-break: break-all;">${resetLink}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="color: #64748b; font-size: 12px;">
              Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
              <br>
              Este enlace expirará en 1 hora.
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error('❌ Error enviando email:', error.message);
      throw error;
    }
  }
}
