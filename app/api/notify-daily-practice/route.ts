import { emailStyles, langInfo, topics } from "@/app/lib/data";
import nodemailer from "nodemailer"
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/service";

const SENDING_EMAIL_NAME = "Hanasu"
const SENDING_EMAIL_ADDRESS = "no-reply@hanasu.ai"


type UserData = {
    id: string
    email: string
    lang: string
    langDisplay: string
}

function emailSubject(data: UserData) {
    return `Keep Up Your ${data.langDisplay} Practice with Today's Daily Topics`
}

function emailBody(data: UserData) {
    return `
<!doctype html>
<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Simple Responsive HTML Email With Button</title>
    <style>
        ${emailStyles}
    </style>
</head>
<body class="">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
    <tr>
        <td>&nbsp;</td>
        <td class="container">
        <div class="header">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td class="align-center" width="100%">
                <a href="https://hanasu.ai"><img src="https:hanasu.ai/favicon.png" height="80" alt="Hanasu"></a>
                </td>
            </tr>
            </table>
        </div>
        <div class="content">

            <!-- START CENTERED WHITE CONTAINER -->
            <table role="presentation" class="main">

            <!-- START MAIN CONTENT AREA -->
            <tr>
                <td class="wrapper">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                    <td>
                        <p>👋&nbsp; Have 5 minutes to spare? Choose from today's topics and practice your Japanese:</p>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                        <tbody>
                            <tr>
                            <td align="center">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tbody>
                                    <tr>
                                    <td> <a href="https://hanasu.ai/dashboard" target="_blank">${topics[0]} &rarr;</a> </td>
                                    </tr>
                                </tbody>
                                </table>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                        <tbody>
                            <tr>
                            <td align="center">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tbody>
                                    <tr>
                                    <td> <a href="https://hanasu.ai/dashboard" target="_blank">${topics[1]} &rarr;</a> </td>
                                    </tr>
                                </tbody>
                                </table>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                        <tbody>
                            <tr>
                            <td align="center">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tbody>
                                    <tr>
                                    <td> <a href="https://hanasu.ai/dashboard" target="_blank">${topics[2]} &rarr;</a> </td>
                                    </tr>
                                </tbody>
                                </table>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                        <p>📚&nbsp; Have fun learning!</p>
                    </td>
                    </tr>
                </table>
                </td>
            </tr>

            <!-- END MAIN CONTENT AREA -->
            </table>

            <!-- START FOOTER -->
            <div class="footer">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                <td class="content-block">
                    Don't want to be notified? <a href="https://hanasu.ai/api/unsubscribe?userId=${data.id}">Unsubscribe</a>
                </td>
                </tr>
            </table>
            </div>
            <!-- END FOOTER -->

        <!-- END CENTERED WHITE CONTAINER -->
        </div>
        </td>
        <td>&nbsp;</td>
    </tr>
    </table>
</body>
</html>
    `
}

const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
        user: SENDING_EMAIL_ADDRESS,
        pass: process.env.HANASU_EMAIL_PASSWORD,
    },
    pool: true,
});



export async function GET(request: NextRequest) {
    // Temporarily disable the daily notification
    return new NextResponse("Daily notifications are temporarily disabled.", { status: 200 });
}