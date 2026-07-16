package com.agrolink.backend.service;

import com.agrolink.backend.dto.message.MessageCreateRequest;
import com.agrolink.backend.model.Message;
import com.agrolink.backend.model.User;
import com.agrolink.backend.repository.MessageRepository;
import com.agrolink.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    private static String newMessageId() {
        return "msg_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    public Message send(MessageCreateRequest payload, User user) {
        List<String> ids = new ArrayList<>(List.of(user.getUserId(), payload.getReceiverId()));
        Collections.sort(ids);
        String threadId = "th_" + ids.get(0) + "_" + ids.get(1);

        Message msg = new Message();
        msg.setMessageId(newMessageId());
        msg.setThreadId(threadId);
        msg.setSenderId(user.getUserId());
        msg.setSenderName(user.getName() != null ? user.getName() : "");
        msg.setReceiverId(payload.getReceiverId());
        msg.setProductId(payload.getProductId());
        msg.setContent(payload.getContent());
        msg.setRead(false);
        msg.setCreatedAt(Instant.now().toString());
        return messageRepository.save(msg);
    }

    /** Mirrors Python's /messages/threads - groups messages by thread, keeps most recent per thread */
    public List<Map<String, Object>> listThreads(User user) {
        String userId = user.getUserId();
        List<Message> all = messageRepository.findAllInvolvingUser(userId); // already sorted desc by createdAt

        LinkedHashMap<String, Message> latestPerThread = new LinkedHashMap<>();
        for (Message m : all) {
            latestPerThread.putIfAbsent(m.getThreadId(), m);
        }

        List<Map<String, Object>> threads = new ArrayList<>();
        for (Map.Entry<String, Message> entry : latestPerThread.entrySet()) {
            Message m = entry.getValue();
            String otherUserId = m.getSenderId().equals(userId) ? m.getReceiverId() : m.getSenderId();

            Map<String, Object> t = new LinkedHashMap<>();
            t.put("thread_id", entry.getKey());
            t.put("last_message", m.getContent());
            t.put("last_at", m.getCreatedAt());
            t.put("other_user_id", otherUserId);

            userRepository.findByUserId(otherUserId).ifPresent(u -> {
                t.put("other_user_name", u.getName() != null ? u.getName() : "");
                t.put("other_user_avatar", u.getAvatar() != null ? u.getAvatar() : "");
                t.put("other_user_role", u.getRole() != null ? u.getRole() : "");
            });
            threads.add(t);
        }
        return threads;
    }

    public List<Message> getThread(String threadId, User user) {
        List<Message> messages = messageRepository.findByThreadIdOrderByCreatedAtAsc(threadId);

        // Mark as read for messages where current user is the receiver
        for (Message m : messages) {
            if (user.getUserId().equals(m.getReceiverId()) && !m.isRead()) {
                m.setRead(true);
                messageRepository.save(m);
            }
        }
        return messages;
    }
}
