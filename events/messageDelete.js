module.exports = (client, message) => {
    client.snipes.set(message.channel.id, {
        content: message.content,
        author: message.author,
        iamge: message.attatchments.first() ? message.attatchments.first().proxyURL: null
    });
}