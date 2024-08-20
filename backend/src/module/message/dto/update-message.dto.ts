import { ApiProperty } from "@nestjs/swagger";

export class UpdateMessageDto   {
    @ApiProperty({
        example: "sent",
        description: 'sent',
    })
    status: string = 'sent'

   
}
