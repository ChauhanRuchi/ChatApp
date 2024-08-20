import { ApiProperty } from "@nestjs/swagger";

export class CreateChatMemberDto {
    @ApiProperty({
        example: "4",
        description: '7',
    })
    firstId: string = '7'

    @ApiProperty({
        example: "4",
        description: '7',
    })
    secoundId: string = '7'
}
