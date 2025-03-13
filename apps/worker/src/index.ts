import { redisClient }  from "redisclient";
import { sendVerificationEmail, sendWelcomeEmail } from "./email/email";


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
                try {
                    const response = await sendVerificationEmail(email as string);
                    if(response.status === true) {
                        console.log('Email sent successfully');
                    }
                } catch (error : unknown) {
                    if(error instanceof Error) {
                        if(error.message === "Email is required") {
                            console.error('Email is required');
                        } else {
                            console.error('Error sending email:', error.message);
                        }
                    }
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
                } catch (error : unknown) {
                    if(error instanceof Error) {
                        if(error.message === "Email or username is required") {
                            console.error('Email or username is required');
                        } else {
                            console.error('Error sending email:', error.message);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error processing welcome email:', error);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}