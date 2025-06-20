import { SubmitTaskResponse } from '@app/core/domain/game/quest/task.repository';
import { SubmitTaskResponseDto } from '@app/tourii-backend/controller/model/tourii-response/submit-tasks-response.model';

export class TaskResultBuilder {
    static submitTaskResponseToDto(submitTaskResponse: SubmitTaskResponse): SubmitTaskResponseDto {
        return {
            success: submitTaskResponse.success,
            message: submitTaskResponse.message,
        };
    }
}
