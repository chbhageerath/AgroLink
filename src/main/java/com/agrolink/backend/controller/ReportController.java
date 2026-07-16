package com.agrolink.backend.controller;

import com.agrolink.backend.model.User;
import com.agrolink.backend.security.AuthUtil;
import com.agrolink.backend.service.ReportService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final AuthUtil authUtil;

    public ReportController(ReportService reportService, AuthUtil authUtil) {
        this.reportService = reportService;
        this.authUtil = authUtil;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary(HttpServletRequest request) {
        User user = authUtil.requireUser(request);
        return reportService.summary(user);
    }
}
