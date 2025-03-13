import { redisClient }  from "redisclient";
import { sendVerificationEmail, sendWelcomeEmail } from "./email/email";

console.log('Started');

(function startEmailProcessor() {
    console.log('Starting email processor...');
    Promise.all([
        processVerificationEmails(),
        processWelcomeEmails()
    ]).catch(error => console.error('Error in email processor:', error));
    return true;
})();


async function processVerificationEmails() {
    while (true) {
        try {
            const result = await redisClient.blPop('email_verification_queue', 0);
            
            if (result) {
                const email = result.element;
                console.log('Email received',email);
                try {
                    const response = await sendVerificationEmail(email as string);
                    if(response.status === true) {
                        console.log('Email sent successfully');
                    }
                } catch (error) {
                    console.error('Error sending email:', error);
                }
            }
        } catch (error) {
            console.error('Error processing verificationemail:', error);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

async function processWelcomeEmails() {
    while (true) {
        try {
            const result = await redisClient.blPop('user_welcome_email_queue', 0);
            if (result) {
                const parsedResult = JSON.parse(result.element);
                const email = parsedResult.email;
                const name = parsedResult.name;
                try {
                    const response = await sendWelcomeEmail(email as string , name as string);
                    if(response.status === true) {
                        console.log('Email sent successfully');
                    }
                } catch (error) {
                    console.error('Error sending email:', error);
                }
            }
        } catch (error) {
            console.error('Error processing welcome email:', error);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}