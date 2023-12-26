const { Events, Collection, ChannelType } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply({ content: 'You are not connected to a voice channel!', ephemeral: true });

        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);

            if (!button) return new Error("There is no code for this button.");

            const { cooldowns } = client;

            if (!cooldowns.has(button.data.name)) {
                cooldowns.set(button.data.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(button.data.name);
            const defaultCooldownDuration = 3;
            const cooldownAmount = (button.cooldown ?? defaultCooldownDuration) * 1000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    return interaction.reply({ content: `Please wait 3 seconds, you are on a cooldown for \`${button.data.name}\`.`, ephemeral: true });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

            try {
                return button.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isStringSelectMenu()) {
            const menu = client.endpoints.get(interaction.customId);

            if (!menu) return new Error("There is no code for this selectMenu.");

            try {
                menu.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);

            if (!modal) return new Error("There is no code for this modal.");

            try {
                modal.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }
        }
    }
}