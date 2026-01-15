import { Context } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

export type ContextType = Context &
  SceneContext & {
    match: RegExpExecArray;
    message: {
      text: string;
      photo?: any[];
      video?: any;
      document?: any;
      audio?: any;
      voice?: any;
    };
    session: {
      lastMessage: any;
      currentDepartment: string;
      userDepartment: string;
      lastSelectedDepartment: string;
      selectedUser: string;
      adminPage: number;
      searchDepartment: string;
      usersNewPhone: string;
      departmentForChange: string;
      usersNewDepartment: string;
      departmentForSendAppeal: string;
      selectedRole: string;

      // Task management
      taskTitle: string;
      taskDescription: string;
      taskDeadline: string;
      taskPriority: string;
      taskAssignedTo: string;
      taskFiles: string[];
      taskImages: string[];
      taskVideos: string[];
      taskAudios: string[];
      selectedTask: string;

      // Report management
      reportTaskId: string;
      reportText: string;
      reportFiles: string[];
      reportImages: string[];
      reportVideos: string[];
      reportAudios: string[];
      reportCompletionPercentage: number;
      selectedReport: string;

      // Messaging
      messageRecipient: string;
      messageText: string;
      messageFiles: string[];
      conversationWith: string;

      // Salary
      salaryMonth: string;
      salaryUserId: string;
      bonusAmount: number;
      penaltyAmount: number;
      salaryEmployeeId: string;
      salaryBase: number;
      salaryBonus: number;
      salaryPenalty: number;

      // Statistics
      statisticsPeriod: string;
      statisticsUserId: string;
    };
  };
