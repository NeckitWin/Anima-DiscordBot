import {WebhookClient} from "discord.js";

export const Webhooks = {
    ServerHandler: new WebhookClient({url: 'https://discord.com/api/webhooks/1355695982804865205/HZrJ8E4_G_0fi4mjCEZh6rIkXAcWzKu8MGs140NcJYwX72EoS0Rff0J3sgGXRMWrabMq'}),
    CommandsHandler: new WebhookClient({url: 'https://discord.com/api/webhooks/1362527841115439305/7kc7gKUjVDq08HmCgkJJ5Uu31bJNIgrsJfIoICkDo7lqZu0si16La6FVbbYsPPOW5VUe'}) ,
    ErrorHandler: new WebhookClient({url: 'https://discord.com/api/webhooks/1362447107142848742/s2hDDWSBIewc5cJgZTJTau-5SOAVzLJK2LOV7-NRbM9jIY_X2ltEHudEUaQK3lFuua_a'}),
}