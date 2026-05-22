const express = require('express');

function loadVersionedRoutes(deps, version) {
  const router = express.Router();
  
  // Import all routes for this version
  const { registerAuthRoutes } = require(`./auth.routes`);
  const { registerAdminRoutes } = require(`./admin.routes`);
  const { registerAttendanceRoutes } = require(`./attendance.routes`);
  const { registerStudentRoutes } = require(`./students.routes`);
  const { registerSmartQuizRoutes } = require(`./smartQuiz.routes`);
  const { registerAiRoutes } = require(`./ai.routes`);
  const { registerChatRoutes } = require(`./chat.routes`);
  const { registerDashboardRoutes } = require(`./dashboard.routes`);
  const { registerReportRoutes } = require(`./reports.routes`);
  const { registerStudyDataRoutes } = require(`./studyData.routes`);
  const { registerUserRoutes } = require(`./users.routes`);
  const { registerInstitutionRoutes } = require(`./institution.routes`);
  const { registerAssignedContentRoutes } = require(`./assignedContent.routes`);
  const { registerAppointmentRoutes } = require(`./appointments.routes`);
  const { registerGuidanceRoutes } = require(`./guidance.routes`);

  // Register them to the version-specific router
  registerAuthRoutes(router, deps);
  registerAdminRoutes(router, deps);
  registerAttendanceRoutes(router, deps);
  registerStudentRoutes(router, deps);
  registerSmartQuizRoutes(router, deps);
  registerAiRoutes(router, deps);
  registerChatRoutes(router, deps);
  registerDashboardRoutes(router, deps);
  registerReportRoutes(router, deps);
  registerStudyDataRoutes(router, deps);
  registerUserRoutes(router, deps);
  registerInstitutionRoutes(router, deps);
  registerAssignedContentRoutes(router, deps);
  registerAppointmentRoutes(router, deps);
  registerGuidanceRoutes(router, deps);

  return router;
}

module.exports = { loadVersionedRoutes };
