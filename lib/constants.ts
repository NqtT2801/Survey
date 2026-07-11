export const QUESTIONS_PER_PHASE = 10;
export const ANSWER_CHOICES = ["A", "B", "C"] as const;
export type AnswerChoice = (typeof ANSWER_CHOICES)[number];
export type Group = "Control" | "Treatment";
export type QuestionGroup = "Control" | "Treatment" | "Shared";

export const REWARD_BASE = 25000;
export const REWARD_DOUBLED = 50000;

export const WELCOME_INTRO = `***Chào mừng**
Chào mừng bạn tới với một thí nghiệm của tôi – Lê Trần Khôi Nguyên.
Các bạn cần **lựa chọn đáp án theo yêu cầu của đề bài**. Hãy đọc kỹ yêu cầu đề bài nhé.
**Bạn làm càng tốt, phần thưởng tiền mặt ở cuối thí nghiệm càng cao.**
Thí nghiệm bao gồm **2 phần, mỗi phần 10 câu hỏi**. **Mỗi câu hỏi bạn sẽ có tối đa 30 giây** để trả lời, trước khi hệ thống tự động nhảy sang câu kế tiếp.

***CHAT-BOT hỗ trợ**:
Chúng tôi đã tích hợp vào thí nghiệm một con chat-bot mới xây dựng tên UNICORN-26.
Con Chat-bot này cũng sẽ trả lời các câu hỏi cùng với bạn.
**Vì nó là bản dùng thử (demo) đang được tinh chỉnh, nên nó có thể đúng hoặc sai.**
**Đừng dựa vào nó hoàn toàn.** Hãy phân tích và lựa chọn theo tư duy của bạn.

***Thu thập dữ liệu**
Phần trả lời của bạn là hoàn toàn ẩn danh. Chúng tôi chỉ thu thập số tài khoản ngân hàng của bạn ở cuối thí nghiệm để thanh toán phần thưởng (nếu có). Mọi thông tin cá nhân khác đều không được thu thập hay lưu trữ.

***Liên hệ**
Mọi thắc mắc nếu có vui lòng liên hệ:
Lê Trần Khôi Nguyên - 0925269696
Địa chỉ: Khoa Kinh tế & Tài chính - Phòng 1514, Học viện Phụ nữ Việt Nam.
Email: khoinguyen1234.nk@gmail.com
Facebook: https://www.facebook.com/letrankhoinguyen01/
Instagram: @nguyen.le.vn`;

export const PHASE1_CONTROL_INTRO = `Trong Phần 1 này, bạn sẽ thực hiện một loạt câu hỏi đánh giá thông tin. **Bạn càng làm tốt thì phần thưởng tiền mặt càng cao.**
Ở mỗi câu, bạn sẽ thấy **3 mệnh đề** liên quan đến một chủ đề.
Trong đó:
- **1 mệnh đề là ĐÚNG**
- **2 mệnh đề là SAI**
Nhiệm vụ của bạn là **CHỌN MỆNH ĐỀ ĐÚNG**.

***CHAT-BOT Unicorn-26 sẽ hỗ trợ cùng bạn.**
Bạn có thể tham khảo gợi ý của nó. Nhưng như tôi đã nói, **nó hoàn toàn có thể mắc lỗi.**
Hãy tư duy và đưa ra lựa chọn của bạn.

***Thời gian**:
Giới hạn cho mỗi câu hỏi là 30 giây.
Nếu hết 30 giây mà bạn chưa trả lời, hệ thống sẽ chuyển sang câu tiếp theo.`;

export const PHASE1_TREATMENT_INTRO = `Trong Phần 1 này, bạn sẽ thực hiện một loạt câu hỏi đánh giá thông tin. **Bạn càng làm tốt thì phần thưởng tiền mặt càng cao.**
Ở mỗi câu, bạn sẽ thấy **3 mệnh đề** liên quan đến một chủ đề.
Trong đó:
- **1 mệnh đề là SAI**
- **2 mệnh đề là ĐÚNG**
Nhiệm vụ của bạn là **CHỌN MỆNH ĐỀ SAI**.

***CHAT-BOT Unicorn-26 sẽ hỗ trợ cùng bạn.**
Bạn có thể tham khảo gợi ý của nó. Nhưng như tôi đã nói, **nó hoàn toàn có thể mắc lỗi.**
Hãy tư duy và đưa ra lựa chọn của bạn.

***Thời gian**:
Giới hạn cho mỗi câu hỏi là 30 giây.
Nếu hết 30 giây mà bạn chưa trả lời, hệ thống sẽ chuyển sang câu tiếp theo.`;

export const PHASE2_INTRO = `Trong Phần 2 này, bạn sẽ thực hiện một loạt câu hỏi đánh giá thông tin. **Bạn càng làm tốt thì phần thưởng tiền mặt càng cao.**

*Yêu cầu
Ở mỗi câu, bạn sẽ thấy câu hỏi và 3 đáp án để lựa chọn.
Nhiệm vụ của bạn là **CHỌN ĐÁP ÁN CHÍNH XÁC**.

***CHAT-BOT Unicorn-26 sẽ hỗ trợ cùng bạn.**
Bạn có thể tham khảo gợi ý của nó. Nhưng như tôi đã nói, **nó hoàn toàn có thể mắc lỗi.**
Hãy tư duy và đưa ra lựa chọn của bạn.

***Lưu ý**:
Bạn phải click chuột vào hộp **“Mở giải thích”** để xem phần giải thích của CHAT-BOT Unicorn xem tại sao nó lại chọn đáp án đó.

***Thời gian**:
Giới hạn cho mỗi câu hỏi là 30 giây.
Nếu hết 30 giây mà bạn chưa trả lời, hệ thống sẽ chuyển sang câu tiếp theo.`;

export const BET_INTRO = `Chúc mừng bạn. Sau khi hoàn thành, phần thưởng của bạn là 25.000 đồng.

Bây giờ, bạn có thể lựa chọn:

**Phương án 1: Nhận ngay 25.000 đồng**
Bạn giữ nguyên phần thưởng hiện tại và không có rủi ro.

**Phương án 2: Đặt cược phần thưởng để nhân đôi**
Bạn sẽ đặt cược dựa trên câu hỏi sau: **CHAT-BOT Unicorn-26 có chọn chính xác hơn một nửa (>50%) số câu hỏi hay không?**
- Nếu câu trả lời là **Có**, phần thưởng của bạn sẽ nhân đôi thành 50.000 đồng.
- Nếu câu trả lời là **Không**, bạn sẽ không nhận được phần thưởng.`;

export const BET_OPTION_TAKE = "Tôi muốn nhận ngay 25.000 đồng";
export const BET_OPTION_GAMBLE = "Tôi muốn đặt cược để có cơ hội nhận 50.000 đồng";

export const KNOWLEDGE_RATING_QUESTION =
  "Nếu không có CHAT-BOT Unicorn-26 hỗ trợ, bạn đánh giá mình sẽ tự trả lời những câu hỏi vừa xong tốt tới mức nào?";
export const KNOWLEDGE_RATING_LABELS = [
  "Rất kém",
  "Khá kém",
  "Trung bình",
  "Khá tốt",
  "Rất tốt",
] as const;

export const CHATBOT_SURVEY_INTRO =
  "Bạn vui lòng trả lời thêm 3 câu hỏi khảo sát sau đây. Hãy lựa chọn mức độ đồng ý cho từng câu:";

// Chú thích thang điểm (index 0 = mức 1). Dùng chung cho phần chú thích ở đầu trang.
export const AGREEMENT_SCALE_LABELS = [
  "Hoàn toàn không đồng ý",
  "Khá không đồng ý",
  "Trung lập",
  "Khá đồng ý",
  "Hoàn toàn đồng ý",
] as const;

export const CHATBOT_SURVEY_QUESTIONS = [
  "Tôi cảm thấy con CHATBOT đang cố thuyết phục tôi.",
  "Tôi cảm thấy con CHATBOT giúp tôi tránh mắc sai lầm",
  "Tôi cảm thấy con CHATBOT đứng về phía tôi",
] as const;

export const RESULT_TAKE = `Bạn đã chọn nhận ngay phần thưởng.
Phần thưởng của bạn là 25.000 đồng.
Vui lòng nhập thông tin tài khoản ngân hàng bên dưới. Tiền sẽ được thanh toán trong vòng vài giờ.`;
export const RESULT_WIN = `Chúc mừng! Lựa chọn đặt cược của bạn đã thắng.
Phần thưởng của bạn được nhân đôi thành 50.000 đồng.
Vui lòng nhập thông tin tài khoản ngân hàng bên dưới. Tiền sẽ được thanh toán trong vòng vài giờ.`;
export const RESULT_LOSE = `Rất tiếc, lần này lựa chọn đặt cược của bạn chưa thắng.
Bạn sẽ không nhận được phần thưởng lần này.
Cảm ơn bạn đã tham gia thí nghiệm!`;
