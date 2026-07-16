package com.agrolink.backend.controller;

import com.agrolink.backend.dto.message.MessageCreateRequest;
import com.agrolink.backend.model.Message;
import com.agrolink.backend.model.User;
import com.agrolink.backend.security.AuthUtil;
import com.agrolink.backend.service.MessageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final AuthUtil authUtil;

    public MessageController(MessageService messageService, AuthUtil authUtil) {
        this.messageService = messageService;
        this.authUtil = authUtil;
    }

    @PostMapping
    public Message send(@Valid @RequestBody MessageCreateRequest payload, HttpServletRequest request) {
        User user = authUtil.requireUser(request);
        return messageService.send(payload, user);
    }

    @GetMapping("/threads")
    public List<Map<String, Object>> listThreads(HttpServletRequest request) {
        User user = authUtil.requireUser(request);
        return messageService.listThreads(user);
    }

    @GetMapping("/{threadId}")
    public List<Message> getThread(@PathVariable String threadId, HttpServletRequest request) {
        User user = authUtil.requireUser(request);
        return messageService.getThread(threadId, user);
    }
}
