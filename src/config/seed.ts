import { prisma } from "config/client";
import { hashPassword } from "services/client/user.service";
import { ACCOUNT_TYPE } from "config/constant";
import { count } from "console";

const initDatabase = async () => {
    const countUser = await prisma.user.count();
    const countRole = await prisma.role.count();
    const countProduct = await prisma.product.count();

    if (countRole === 0) {
        await prisma.role.createMany({
            data: [
                {
                    name: "ADMIN",
                    description: "Admin full quyen"
                },
                {
                    name: "USER",
                    description: "User thong thuong"
                }
            ]
        })
    }

    if (countUser === 0) {
        const defaultPassword = await hashPassword("123456");
        const adminRole = await prisma.role.findFirst({
            where: { name: "ADMIN" }
        })
        if (adminRole)
            await prisma.user.createMany({
                data: [
                    {
                        fullName: "Hoi Dan IT",
                        username: "hoidanit@gmail.com",
                        password: defaultPassword,
                        accountType: ACCOUNT_TYPE.SYSTEM,
                        roleId: adminRole.id
                    },
                    {
                        fullName: "Admin",
                        username: "admin@gmail.com",
                        password: defaultPassword,
                        accountType: ACCOUNT_TYPE.SYSTEM,
                        roleId: adminRole.id
                    }
                ]
            })
    }

    if (countProduct === 0) {
        const products = [
            {
                name: " Yonex Arcsaber 0 Feel",
                price: 579000,
                detailDesc: "Vợt cầu lông Yonex Arcsaber 0 Feel là cây vợt thuộc phân khúc giá rẻ của thương hiệu Yonex, với chỉ số cân bằng cùng đũa vợt siêu dẻo cho khả năng hỗ trợ lực, hướng tới đối tượng là những bạn mới chơi yêu thích lối đánh công thủ toàn diện.",
                shortDesc: " Công Thủ Toàn Diện",
                quantity: 100,
                brand: "YONEX",
                level: "BEGINNER",
                image: "yonex_arcsaber_0_feel.png"
            },
            {
                name: "Yonex Astrox 77 Play",
                price: 999000,
                detailDesc: "Vợt cầu lông Yonex Astrox 77 Play là phiên bản của Yonex thuộc bộ sưu tập Yonex Astrox 77 Pro, Tour, Play. Là phiên bản thấp nhất trong bộ sưu tập đáp ứng cho người yêu thích nhà Yonex mà lại vừa mới ra mắt, giá cả phải chăng phù hợp cho các bạn học sinh sinh viên.",
                shortDesc: " Tấn Công",
                quantity: 200,
                brand: "YONEX",
                level: "BEGINNER",
                image: "yonex-astrox-77-play.png"
            },
            {
                name: "Yonex Nanoflare 800 Play",
                price: 1329000,
                detailDesc: "Vợt cầu lông Yonex Nanoflare 800 Play Chính Hãng thuộc series mới và HOT nhất của nhà Yonex trong cuối năm 2023, được chính thức được ra mắt vào ngày 17/11/2023 hứa hẹn sẽ mang lại cơn sốt trên thị trường cầu lông thế giới như những gì mà đàn anh Nanoflare 1000 đã làm được trước đó. Ở series mới này, khung vợt Nanoflare 800 Play được vát theo bộ khung Aero Frame giúp khung vợt thon mượt mà để giảm tối đa lực cản không khí, cho ra những cú vung vợt với tốc độ tối đa.",
                shortDesc: "Phản Tạt, Phòng Thủ",
                quantity: 150,
                brand: "YONEX",
                level: "INTERMEDIATE",
                image: "yonex-nanoflare-800-play.png"
            },
            {
                name: "Yonex Voltric GlanZ",
                price: 3890000,
                detailDesc: "Vợt cầu lông Yonex Voltric GlanZ chuyên phản tạt, tốc độ nhanh phù hợp với các trận đấu giằng co diễn ra với tốc độ cao. Thông thường, vợt chuyên công sẽ không hoặc ít linh hoạt trong các kỹ thuật phòng thủ nhưng với Voltric GlanZ, kết hợp rất nhiều những công nghệ chuyên biệt của dòng Voltric, Voltric GlanZ không chỉ mang đến cám giác tấn công ấn tượng đầy hiệu quả của sự chắc chắn và ổn định mà còn mang đến lối chơi linh hoạt hơn cho người chơi tấn công. Đây là điều mà Yonex đã rất thành công khi áp dụng những công nghệ này vào dòng vợt Voltric.",
                shortDesc: "Công Thủ Toàn Diện",
                quantity: 99,
                brand: "YONEX",
                level: "ADVANCED",
                image: "yonex-voltric-glanz.png"
            },
            {
                name: "Yonex Astrox 77 Pro Xanh China Limited",
                price: 13500000,
                detailDesc: "Vợt Cầu Lông Yonex Astrox 77 Pro Xanh China Limited là một phiên bản đặc biệt được tạo ra để tôn vinh VĐV xuất sắc Huang Ya Qiong, ngôi sao hàng đầu trong làng cầu lông đôi nam nữ thế giới. Được biết đến với thành tích ấn tượng và tài năng xuất sắc, Huang Ya Qiong đã chinh phục cảm tình của người hâm mộ trên toàn cầu. Với sự hợp tác chặt chẽ giữa Yonex và Huang Ya Qiong, phiên bản Astrox 77 Pro Xanh China Limited mang đến không chỉ là một chiếc vợt chất lượng cao mà còn là biểu tượng của sự nghiệp và thành công của VĐV nổi tiếng này.",
                shortDesc: "Tấn Công",
                quantity: 99,
                brand: "YONEX",
                level: "MASTER",
                image: "yonex-astrox-77-pro-xanh-china-limited.png"
            },
            {
                name: "Victor DriveX 7777K",
                price: 1250000,
                detailDesc: "Victor DriveX 7777K thuộc series DriveX của nhà Victor có ưu điểm trong những pha phòng thủ, phản tạt, vợt sẽ phù hợp hơn khi sử dụng trong Đánh Đôi và đặc biệt là ở vị trí cầu trước đảm bảo sẽ cho người chơi xử lí tốt nhất trong những pha cầu nhanh. Ngoài ra với thiết kế đầu khung vợt tròn mang đến những cú đánh có độ chuẩn xác cao, khả năng đập cầu của vợt cầu lông Victor DriveX 7777K cũng khá tốt nhất là với những pha đập cầu chéo sân, đập cầu gõ siêu chất lượng. Tổng thể vợt Victor DriveX 7777K được phủ lên mình tông màu Đen Nhám chủ đạo cho sự mạnh mẽ, hiện đại kết hợp thêm các họa tiết decal màu Cam ở khung và phần đũa tạo sự nổi bật đảm bảo sẽ làm các lông thủ cực ưng ý ngay từ cái nhìn đầu tiên",
                shortDesc: "Công Thủ Toàn Diện",
                quantity: 99,
                brand: "VICTOR",
                level: "BEGINNER",
                image: "victor-drivex-7777k.png"
            },
            {
                name: "Victor JS12II",
                price: 2600000,
                detailDesc: "Victor JS12II còn được biết đến với cái tên Jetspeed S12 II vừa được nhà Victor cho ra mắt trong đầu năm 2022 hướng đến lối chơi nhanh nhẹn, tốc độ nhất trên sân và hiện siêu phẩm này đang được vận động viên cầu lông đôi nam nữ số 1 Indonesia - Melati Daeva Oktaviani sử dụng thi đấu rất thành công",
                shortDesc: "Phản Tạt, Phòng Thủ",
                quantity: 99,
                brand: "VICTOR",
                level: "INTERMEDIATE",
                image: "victor-js12ii.png"
            },
            {
                name: "Victor Mjolnir Metallic Limited 2024",
                price: 4650000,
                detailDesc: "Vợt cầu lông Victor Mjolnir Metallic Limited 2024 là sản phẩm cao cấp vừa được ra mắt của thương hiệu Victor với thiết kế lấy cảm hứng từ chiếc búa Mjolnir của nhân vật Thor trong loạt phim Marvel nổi tiếng trên toàn thế giới",
                shortDesc: "Tấn Công",
                quantity: 99,
                brand: "VICTOR",
                level: "ADVANCED",
                image: "victor-mjolnir-metallic-limited-2024.png"
            },
            {
                name: "Lining Bladex Spiral",
                price: 880000,
                detailDesc: "Vợt cầu lông Lining Bladex Spiral là sản phẩm vợt cầu lông Lining thuộc phân khúc giá rẻ nhưng vẫn được tích hợp nhiều công nghệ tiên tiến của hãng mang đến người dùng một cây vợt chất lượng.",
                shortDesc: "Công Thủ Toàn Diện",
                quantity: 99,
                brand: "LINING",
                level: "BEGINNER",
                image: "lining-bladex-spiral.png"
            },
            {
                name: "Mizuno Carbo Pro 835",
                price: 1040000,
                detailDesc: "Vợt cầu lông Mizuno Carbo Pro 835 là một trong những sản phẩm nổi bật của thương hiệu Mizuno, được thiết kế dành riêng cho những tay vợt yêu thích lối đánh tấn công. Vợt được thiết kế với phối màu xanh neon làm chủ đạo tạo cảm giác mạnh mẽ và khoẻ khoắn.",
                shortDesc: "Tấn Công",
                quantity: 99,
                brand: "MIZUNO",
                level: "BEGINNER",
                image: "mizuno-carbo-pro-835.png"
            }
        ];

        await prisma.product.createMany({
            data: products
        })
    }

    if (countRole !== 0 && countUser !== 0) {
        console.log(">>> ALREADY INIT DATA...");
    }

}

export default initDatabase;