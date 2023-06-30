import { ApiProperty } from "@nestjs/swagger";
import { AddrManger } from "./addrs-manger.schema";

export class MemberDetailResponse {
    @ApiProperty({
        description: '用户地址信息',
    })
    address: AddrManger[];
}