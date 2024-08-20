import { ApiProperty } from "@nestjs/swagger"

export class CreateNotificationDto {
    @ApiProperty({
        example: "4",
        description: '7',
    })
    sender_id: string = '7'

    @ApiProperty({
        example: "4",
        description: '7',
    })
    message: string = '7'

    @ApiProperty({
        example: "4",
        description: '7',
    })
    message_id: string = '..hhff'

    @ApiProperty({
        example: "sent",
        description: 'sent',
    })
    status: string = 'sent'

    @ApiProperty({
        example: 'false',
        description: 'false',
    })
    isRead: boolean = false

    
}
