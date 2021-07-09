import nodemailer from 'nodemailer';
import logger from "./logger";
import config from 'config';

/**
 * Функция отправки сообщений на почту
 *
 * @param {string} to Email получателя
 * @param {string} subject Заголовок
 * @param {string} text Текст письма
 * @param {string} html Что-то форматированное через HTML
 * @param {Array} attachments  Список файлов прикреплённых к письму
 * 
 * @returns { Promise<boolean> }
 */
export default async function mail(
  to,
  subject = '',
  text = '',
  html = '',
  attachments = []) {
  
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.mail.ru',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.get('emailSendMessage'),
        pass: config.get('passSendMessage')
      }
    })

    let result = await transporter.sendMail({
      from: `"---" <${config.get('emailSendMessage')}>`,
      to,
      subject,
      text,
      html,
      attachments
    })

    logger.info(`Успешная отправка сообщения на почту. ${JSON.stringify({ to, subject, text, html })}`)
    return true
  } catch (err) {
    logger.error(`Ошибка отправки сообщения на почту. ${JSON.stringify({ to, subject, text, html })}. ${err}`)
    return false
  }
}