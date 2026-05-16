export const QUESTIONS_PER_PHASE = 10;
export const ANSWER_CHOICES = ["A", "B", "C"] as const;
export type AnswerChoice = (typeof ANSWER_CHOICES)[number];
export type Group = "Control" | "Treatment";
export type QuestionGroup = "Control" | "Treatment" | "Shared";

export const REWARD_BASE = 25000;
export const REWARD_DOUBLED = 50000;

export const WELCOME_INTRO = `Chào mừng bạn tới với một thí nghiệm của tôi.

Trong thí nghiệm này, các bạn sẽ được yêu cầu lựa chọn đáp án theo yêu cầu của đề bài. Hãy đọc kỹ yêu cầu đề bài nhé.
Bạn lựa chọn càng chính xác ở nhiều câu hỏi, phần thưởng tiền mặt sau khi kết thúc sẽ càng cao.
Thí nghiệm bao gồm 2 phần, mỗi phần 10 câu hỏi. Mỗi câu hỏi bạn sẽ có tối đa 20 giây để trả lời, trước khi hệ thống tự động nhảy sang câu kế tiếp.

Chúng tôi đã tích hợp vào hệ thống một con chat-bot đang được xây dựng và kiểm tra năng lực. Nó sẽ khuyến nghị đáp án ở từng câu hỏi cho bạn.
Vì nó là bản dùng thử đang được tinh chỉnh, nên nó có thể đúng hoặc sai. Bạn có thể tin tưởng lựa chọn theo nó hoặc không.

Phần trả lời của bạn là hoàn toàn ẩn danh. Chúng tôi chỉ thu thập số tài khoản ngân hàng của bạn ở cuối thí nghiệm để thanh toán phần thưởng (nếu có). Mọi thông tin cá nhân khác đều không được thu thập hay lưu trữ.

Mọi thắc mắc nếu có vui lòng liên hệ Khôi Nguyên - 0925269696
Hoặc email: khoinguyen1234.nk@gmail.com`;

export const PHASE1_CONTROL_INTRO = `Trong phần này, bạn sẽ thực hiện một loạt câu hỏi đánh giá thông tin. Kết quả của bạn sẽ được dùng để tính phần thưởng tiền mặt ở cuối bài.

Ở mỗi câu, bạn sẽ thấy 3 mệnh đề liên quan đến một chủ đề.
Trong đó:
- 1 mệnh đề là ĐÚNG
- 2 mệnh đề là SAI

Nhiệm vụ của bạn là CHỌN MỆNH ĐỀ ĐÚNG.

Hệ thống gợi ý:
Trong quá trình làm bài, bạn sẽ thấy một gợi ý từ hệ thống chatbot hỗ trợ. Hệ thống này được thiết kế để phân tích nội dung câu hỏi và đưa ra đề xuất về lựa chọn phù hợp.

Bạn có thể:
- tham khảo gợi ý này
- hoặc tự đưa ra quyết định của riêng bạn.

Thời gian:
Giới hạn cho mỗi câu hỏi là 20 giây. Nếu hết 20 giây mà bạn chưa trả lời, hệ thống sẽ chuyển sang câu tiếp theo.`;

export const PHASE1_TREATMENT_INTRO = `Trong phần này, bạn sẽ thực hiện một loạt câu hỏi đánh giá thông tin. Kết quả của bạn sẽ được dùng để tính phần thưởng tiền mặt ở cuối bài.

Ở mỗi câu, bạn sẽ thấy 3 mệnh đề liên quan đến một chủ đề.
Trong đó:
- 1 mệnh đề là SAI
- 2 mệnh đề là ĐÚNG

Nhiệm vụ của bạn là CHỌN MỆNH ĐỀ SAI.

Hệ thống gợi ý:
Trong quá trình làm bài, bạn sẽ thấy một gợi ý từ hệ thống chatbot hỗ trợ. Hệ thống này được thiết kế để phân tích nội dung câu hỏi và đưa ra đề xuất về lựa chọn phù hợp.

Bạn có thể:
- tham khảo gợi ý này
- hoặc tự đưa ra quyết định của riêng bạn.

Thời gian:
Giới hạn cho mỗi câu hỏi là 20 giây. Nếu hết 20 giây mà bạn chưa trả lời, hệ thống sẽ chuyển sang câu tiếp theo.`;

export const PHASE2_INTRO = `Trong phần này, bạn sẽ thực hiện một loạt câu hỏi đánh giá thông tin. Kết quả của bạn sẽ được dùng để tính phần thưởng tiền mặt ở cuối bài.

Ở mỗi câu, bạn sẽ thấy câu hỏi và 3 đáp án để lựa chọn.

Nhiệm vụ của bạn là CHỌN ĐÁP ÁN CHÍNH XÁC.

Hệ thống gợi ý:
Trong quá trình làm bài, bạn sẽ thấy một gợi ý từ hệ thống chatbot hỗ trợ. Hệ thống này được thiết kế để phân tích nội dung câu hỏi và đưa ra đề xuất về lựa chọn phù hợp.

Bạn có thể:
- tham khảo gợi ý này
- hoặc tự đưa ra quyết định của riêng bạn.

*Lưu ý: bạn phải click chuột vào hộp lập luận để xem được phần lập luận của khuyến nghị.

Thời gian:
Giới hạn cho mỗi câu hỏi là 20 giây. Nếu hết 20 giây mà bạn chưa trả lời, hệ thống sẽ chuyển sang câu tiếp theo.`;

export const BET_INTRO = `Sau khi hoàn thành hai phần của bài nghiên cứu, bạn hiện có phần thưởng là 25.000 đồng.

Bây giờ, bạn có thể lựa chọn:

Phương án 1: Nhận ngay 25.000 đồng
Bạn giữ nguyên phần thưởng hiện tại và không có rủi ro.

Phương án 2: Đặt cược phần thưởng
Bạn sẽ đặt cược dựa trên câu hỏi sau:
Chatbot được sử dụng trong phần thí nghiệm vừa rồi có lựa chọn đúng hơn một nửa (>50%) số câu hỏi hay không?
Nếu câu trả lời là Có, phần thưởng của bạn sẽ nhân đôi thành 50.000 đồng.
Nếu câu trả lời là Không, bạn sẽ không nhận được phần thưởng.`;

export const BET_OPTION_TAKE = "Tôi muốn nhận ngay 25.000 đồng";
export const BET_OPTION_GAMBLE = "Tôi muốn đặt cược để có cơ hội nhận 50.000 đồng";

export const KNOWLEDGE_RATING_QUESTION =
  "Nếu không có gợi ý hỗ trợ từ chatbot, bạn đánh giá mình sẽ tự trả lời những câu hỏi vừa xong tốt tới mức nào?";
export const KNOWLEDGE_RATING_LABELS = [
  "Rất kém",
  "Khá kém",
  "Trung bình",
  "Khá tốt",
  "Rất tốt",
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
