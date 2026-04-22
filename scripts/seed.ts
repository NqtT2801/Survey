import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";

// Load env from .env.local if present; fall back to .env.local.example.
const envFile = existsSync(".env.local")
  ? ".env.local"
  : existsSync(".env.local.example")
    ? ".env.local.example"
    : null;
if (envFile) loadEnv({ path: envFile });
if (!process.env.DATABASE_URL) {
  console.error(
    "DATABASE_URL is not set. Put it in .env.local or .env.local.example before running.",
  );
  process.exit(1);
}

type Seed = {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  rightAnswer: "A" | "B" | "C";
  recommendation: "A" | "B" | "C";
  explanation: string;
};

// ---------------------------------------------------------------------------
// Phase 1 / Control — Địa lý & Lịch sử (10)
// ---------------------------------------------------------------------------
const phase1Control: Seed[] = [
  {
    text: "Thủ đô của Việt Nam hiện nay là thành phố nào?",
    optionA: "Thành phố Hồ Chí Minh",
    optionB: "Hà Nội",
    optionC: "Đà Nẵng",
    rightAnswer: "B",
    recommendation: "B",
    explanation:
      "Hà Nội là thủ đô chính thức của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam kể từ năm 1976 sau khi đất nước thống nhất.",
  },
  {
    text: "Dãy núi nào dài nhất Việt Nam, chạy dọc theo biên giới phía tây?",
    optionA: "Dãy Hoàng Liên Sơn",
    optionB: "Dãy Trường Sơn",
    optionC: "Dãy Bạch Mã",
    rightAnswer: "B",
    recommendation: "B",
    explanation:
      "Dãy Trường Sơn dài khoảng 1.100 km, chạy dọc biên giới Việt Nam – Lào – Campuchia.",
  },
  {
    text: "Chiến thắng Điện Biên Phủ diễn ra vào năm nào?",
    optionA: "1945",
    optionB: "1954",
    optionC: "1975",
    rightAnswer: "B",
    recommendation: "A",
    explanation:
      "Chiến dịch Điện Biên Phủ kết thúc ngày 7/5/1954, đánh dấu thắng lợi quyết định của Việt Nam trong cuộc kháng chiến chống Pháp.",
  },
  {
    text: "Con sông nào chảy qua trung tâm thủ đô Hà Nội?",
    optionA: "Sông Sài Gòn",
    optionB: "Sông Mê Kông",
    optionC: "Sông Hồng",
    rightAnswer: "C",
    recommendation: "C",
    explanation:
      "Sông Hồng chảy qua Hà Nội và là con sông quan trọng nhất ở miền Bắc Việt Nam.",
  },
  {
    text: "Vị vua nào đã dời kinh đô từ Hoa Lư ra Thăng Long vào năm 1010?",
    optionA: "Lý Thái Tổ",
    optionB: "Trần Thái Tông",
    optionC: "Lê Thái Tổ",
    rightAnswer: "A",
    recommendation: "A",
    explanation:
      "Lý Thái Tổ (Lý Công Uẩn) ban Chiếu dời đô năm 1010, dời từ Hoa Lư ra Đại La và đổi tên thành Thăng Long.",
  },
  {
    text: "Quốc gia nào có diện tích lớn nhất thế giới?",
    optionA: "Canada",
    optionB: "Trung Quốc",
    optionC: "Nga",
    rightAnswer: "C",
    recommendation: "C",
    explanation:
      "Liên bang Nga có diện tích khoảng 17,1 triệu km², gần gấp đôi nước đứng thứ hai.",
  },
  {
    text: "Ai là Chủ tịch đầu tiên của nước Việt Nam Dân chủ Cộng hòa?",
    optionA: "Hồ Chí Minh",
    optionB: "Võ Nguyên Giáp",
    optionC: "Phạm Văn Đồng",
    rightAnswer: "A",
    recommendation: "A",
    explanation:
      "Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập ngày 2/9/1945, khai sinh nước Việt Nam Dân chủ Cộng hòa.",
  },
  {
    text: "Vịnh Hạ Long thuộc tỉnh nào của Việt Nam?",
    optionA: "Quảng Ninh",
    optionB: "Hải Phòng",
    optionC: "Thanh Hóa",
    rightAnswer: "A",
    recommendation: "B",
    explanation:
      "Vịnh Hạ Long nằm ở tỉnh Quảng Ninh và được UNESCO công nhận là Di sản Thiên nhiên Thế giới.",
  },
  {
    text: "Vạn Lý Trường Thành là công trình cổ của quốc gia nào?",
    optionA: "Nhật Bản",
    optionB: "Hàn Quốc",
    optionC: "Trung Quốc",
    rightAnswer: "C",
    recommendation: "C",
    explanation:
      "Vạn Lý Trường Thành là hệ thống công sự quân sự dài hàng nghìn kilômét của Trung Quốc, xây dựng qua nhiều triều đại.",
  },
  {
    text: "Đại dương nào lớn nhất thế giới theo diện tích?",
    optionA: "Đại Tây Dương",
    optionB: "Thái Bình Dương",
    optionC: "Ấn Độ Dương",
    rightAnswer: "B",
    recommendation: "C",
    explanation:
      "Thái Bình Dương rộng khoảng 165 triệu km², chiếm khoảng một phần ba bề mặt Trái Đất.",
  },
];

// ---------------------------------------------------------------------------
// Phase 1 / Treatment — Khoa học & Tự nhiên (10)
// ---------------------------------------------------------------------------
const phase1Treatment: Seed[] = [
  {
    text: "Nước tinh khiết sôi ở nhiệt độ nào tại áp suất khí quyển chuẩn?",
    optionA: "90°C",
    optionB: "100°C",
    optionC: "110°C",
    rightAnswer: "B",
    recommendation: "B",
    explanation:
      "Ở áp suất 1 atm (mực nước biển), nước tinh khiết sôi ở 100°C.",
  },
  {
    text: "Hành tinh nào gần Mặt Trời nhất trong hệ Mặt Trời?",
    optionA: "Sao Kim",
    optionB: "Sao Thủy",
    optionC: "Trái Đất",
    rightAnswer: "B",
    recommendation: "A",
    explanation:
      "Sao Thủy là hành tinh trong cùng, cách Mặt Trời trung bình khoảng 58 triệu km.",
  },
  {
    text: "Công thức hóa học của phân tử nước là gì?",
    optionA: "H2O",
    optionB: "CO2",
    optionC: "O2",
    rightAnswer: "A",
    recommendation: "A",
    explanation:
      "Mỗi phân tử nước gồm hai nguyên tử hydro liên kết với một nguyên tử oxy.",
  },
  {
    text: "Loài động vật có vú lớn nhất hiện còn tồn tại trên Trái Đất là?",
    optionA: "Voi châu Phi",
    optionB: "Cá voi xanh",
    optionC: "Hà mã",
    rightAnswer: "B",
    recommendation: "B",
    explanation:
      "Cá voi xanh có thể dài tới 30 mét và nặng hơn 150 tấn, lớn nhất trong tất cả các loài động vật từng được biết.",
  },
  {
    text: "Cơ quan nào trong cơ thể người đảm nhiệm việc bơm máu đi toàn thân?",
    optionA: "Gan",
    optionB: "Phổi",
    optionC: "Tim",
    rightAnswer: "C",
    recommendation: "C",
    explanation:
      "Tim là cơ quan cơ bắp bơm máu qua hệ tuần hoàn, cung cấp oxy và dưỡng chất cho mọi mô.",
  },
  {
    text: "Trong tiếng Anh, DNA là viết tắt của cụm từ nào?",
    optionA: "Deoxyribonucleic Acid",
    optionB: "Dynamic Neural Association",
    optionC: "Dual Nitrogen Assembly",
    rightAnswer: "A",
    recommendation: "A",
    explanation:
      "DNA (Deoxyribonucleic Acid) là phân tử mang thông tin di truyền ở gần như mọi sinh vật sống.",
  },
  {
    text: "Vận tốc ánh sáng trong chân không xấp xỉ bao nhiêu?",
    optionA: "Khoảng 300.000 km/giây",
    optionB: "Khoảng 30.000 km/giây",
    optionC: "Khoảng 3.000.000 km/giây",
    rightAnswer: "A",
    recommendation: "A",
    explanation:
      "Vận tốc ánh sáng trong chân không là 299.792 km/giây, thường làm tròn thành 300.000 km/giây.",
  },
  {
    text: "Hiện tượng nhật thực xảy ra khi nào?",
    optionA: "Khi Mặt Trăng nằm giữa Trái Đất và Mặt Trời",
    optionB: "Khi Trái Đất nằm giữa Mặt Trăng và Mặt Trời",
    optionC: "Khi Mặt Trời nằm giữa Trái Đất và Mặt Trăng",
    rightAnswer: "A",
    recommendation: "B",
    explanation:
      "Nhật thực xảy ra khi Mặt Trăng che khuất Mặt Trời khi quan sát từ Trái Đất, tức Mặt Trăng ở giữa Trái Đất và Mặt Trời.",
  },
  {
    text: "Khí nào chiếm tỉ lệ lớn nhất trong khí quyển Trái Đất?",
    optionA: "Oxy",
    optionB: "Nitơ",
    optionC: "Cacbon đioxit",
    rightAnswer: "B",
    recommendation: "B",
    explanation:
      "Nitơ chiếm khoảng 78% khí quyển Trái Đất; oxy chỉ khoảng 21%.",
  },
  {
    text: "Loại đá nào được hình thành khi magma hoặc dung nham nguội đi và đông cứng?",
    optionA: "Đá trầm tích",
    optionB: "Đá biến chất",
    optionC: "Đá magma (đá mácma)",
    rightAnswer: "C",
    recommendation: "A",
    explanation:
      "Đá magma (đá mácma) hình thành khi magma bên trong hoặc dung nham phun trào nguội và kết tinh.",
  },
];

// ---------------------------------------------------------------------------
// Phase 2 / Shared — Hỗn hợp (Văn học, Toán/Logic, Thể thao, Văn hóa) (10)
// ---------------------------------------------------------------------------
const phase2Shared: Seed[] = [
  {
    text: "Tác giả của kiệt tác 'Truyện Kiều' là ai?",
    optionA: "Nguyễn Du",
    optionB: "Hồ Xuân Hương",
    optionC: "Nguyễn Trãi",
    rightAnswer: "A",
    recommendation: "A",
    explanation:
      "'Truyện Kiều' (Đoạn trường tân thanh) là kiệt tác của đại thi hào Nguyễn Du, viết đầu thế kỷ 19.",
  },
  {
    text: "15 × 12 bằng bao nhiêu?",
    optionA: "170",
    optionB: "180",
    optionC: "190",
    rightAnswer: "B",
    recommendation: "B",
    explanation: "15 × 12 = 15 × 10 + 15 × 2 = 150 + 30 = 180.",
  },
  {
    text: "Môn thể thao nào được mệnh danh là 'môn thể thao vua'?",
    optionA: "Bóng đá",
    optionB: "Bóng rổ",
    optionC: "Quần vợt",
    rightAnswer: "A",
    recommendation: "A",
    explanation:
      "Bóng đá được gọi là 'môn thể thao vua' do độ phổ biến và lượng người hâm mộ trên toàn thế giới.",
  },
  {
    text: "Thế vận hội Olympic mùa hè được tổ chức mấy năm một lần?",
    optionA: "2 năm",
    optionB: "4 năm",
    optionC: "6 năm",
    rightAnswer: "B",
    recommendation: "B",
    explanation:
      "Thế vận hội Olympic mùa hè diễn ra theo chu kỳ 4 năm, ngoại trừ các kỳ bị hoãn vì chiến tranh hoặc dịch bệnh.",
  },
  {
    text: "Số nguyên tố nhỏ nhất là số nào?",
    optionA: "0",
    optionB: "1",
    optionC: "2",
    rightAnswer: "C",
    recommendation: "B",
    explanation:
      "Theo định nghĩa hiện đại, số nguyên tố phải lớn hơn 1 và chỉ có đúng hai ước là 1 và chính nó, nên 2 là số nguyên tố nhỏ nhất.",
  },
  {
    text: "Tác phẩm 'Dế Mèn phiêu lưu ký' là của tác giả nào?",
    optionA: "Tô Hoài",
    optionB: "Nguyễn Nhật Ánh",
    optionC: "Nam Cao",
    rightAnswer: "A",
    recommendation: "A",
    explanation: "'Dế Mèn phiêu lưu ký' được Tô Hoài sáng tác năm 1941.",
  },
  {
    text: "Đơn vị tiền tệ chính thức của Nhật Bản là gì?",
    optionA: "Won",
    optionB: "Yên (Yen)",
    optionC: "Nhân dân tệ",
    rightAnswer: "B",
    recommendation: "B",
    explanation: "Đồng Yên Nhật (JPY) là đơn vị tiền tệ chính thức của Nhật Bản.",
  },
  {
    text: "Giải Nobel được sáng lập bởi ai theo di chúc để lại?",
    optionA: "Albert Einstein",
    optionB: "Alfred Nobel",
    optionC: "Marie Curie",
    rightAnswer: "B",
    recommendation: "C",
    explanation:
      "Alfred Nobel, nhà hóa học và kỹ sư Thụy Điển (người phát minh ra thuốc nổ dynamite), đã để lại tài sản để lập giải Nobel qua di chúc năm 1895.",
  },
  {
    text: "Một chiếc xe đi được 60 km trong đúng 1 giờ. Vận tốc trung bình là bao nhiêu?",
    optionA: "30 km/h",
    optionB: "60 km/h",
    optionC: "120 km/h",
    rightAnswer: "B",
    recommendation: "B",
    explanation:
      "Vận tốc trung bình = quãng đường ÷ thời gian = 60 km ÷ 1 giờ = 60 km/h.",
  },
  {
    text: "Ngọn núi cao nhất thế giới tính từ mực nước biển là?",
    optionA: "K2",
    optionB: "Everest",
    optionC: "Kilimanjaro",
    rightAnswer: "B",
    recommendation: "A",
    explanation:
      "Đỉnh Everest (Chomolungma) thuộc dãy Himalaya cao 8.848,86 mét so với mực nước biển, là ngọn núi cao nhất thế giới.",
  },
];

function assertBucket(name: string, list: Seed[]) {
  if (list.length !== 10) {
    throw new Error(`Bucket "${name}" has ${list.length} items, expected 10.`);
  }
}

async function main() {
  assertBucket("Phase 1 / Control", phase1Control);
  assertBucket("Phase 1 / Treatment", phase1Treatment);
  assertBucket("Phase 2 / Shared", phase2Shared);

  // Import DB client AFTER env is loaded (lazy proxy would otherwise throw).
  const { db, schema } = await import("../lib/db/index.js");
  const { count } = await import("drizzle-orm");

  // Count existing data before wipe so we can report it.
  const [{ a }] = await db.select({ a: count() }).from(schema.answers);
  const [{ s }] = await db.select({ s: count() }).from(schema.sessions);
  const [{ q }] = await db.select({ q: count() }).from(schema.questions);

  // Wipe in FK-safe order: answers → sessions → questions.
  await db.delete(schema.answers);
  await db.delete(schema.sessions);
  await db.delete(schema.questions);

  const build = (
    list: Seed[],
    phase: 1 | 2,
    group: "Control" | "Treatment" | "Shared",
  ) =>
    list.map((item, i) => ({
      phase,
      group,
      order: i + 1,
      ...item,
    }));

  const rows = [
    ...build(phase1Control, 1, "Control"),
    ...build(phase1Treatment, 1, "Treatment"),
    ...build(phase2Shared, 2, "Shared"),
  ];

  await db.insert(schema.questions).values(rows);

  const wrongRecs = rows.filter((r) => r.rightAnswer !== r.recommendation).length;
  console.log(
    `Seeded ${rows.length} questions across 3 buckets (${wrongRecs} with mismatched recommendation). Wiped ${q} questions, ${s} sessions, ${a} answers.`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
