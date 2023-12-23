const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require("discord.js")

module.exports = {
    data: {
        name: `loop`
    },
    async execute(interaction) {
        const checkResponse = await interaction.deferReply({ ephemeral: true })
        try {
            const selectMode = new StringSelectMenuBuilder()
                .setCustomId('loopMode')
                .setPlaceholder('Select loop mode')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Current song')
                        .setValue('1'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('All songs')
                        .setValue('2'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Off')
                        .setValue('0'),
                )
            const actionRow = new ActionRowBuilder().addComponents(selectMode)

            const response = await interaction.editReply({ components: [actionRow], ephemeral: true })

            const collectorFilter = i => i.user.id === interaction.user.id;

            try {
                const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 })
                if (confirmation.customId === 'loopMode') {
                    return checkResponse.delete()
                }
            } catch (error) {
                return interaction.editReply({ content: `You have not chosen anything.`, ephemeral: true, components: [] })
            }
        } catch (error) {
        }
    }
}