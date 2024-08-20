import { ApiProperty } from "@nestjs/swagger"

export class CreateMessageDto {
    @ApiProperty({
        example: "1",
        description: '1',
    })
    chat_id: string = '1'

    @ApiProperty({
        example: "2",
        description: '2',
    })
    sender_id: string = '2'

    @ApiProperty({
        example: "1",
        description: '1',
    })
    receiver_id: string = '1'

    @ApiProperty({
        example: "2",
        description: '2',
    })
    message_type: string = '2'
    @ApiProperty({
        example: "2",
        description: '2',
    })
    status: string = '2'
    @ApiProperty({
        example: "abc",
        description: 'abc',
    })
    content: string = 'abc'
}
