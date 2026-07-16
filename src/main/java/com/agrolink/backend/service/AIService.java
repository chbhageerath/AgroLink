package com.agrolink.backend.service;

import com.agrolink.backend.dto.AIRequest;
import com.agrolink.backend.exception.ApiException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class AIService {

    @Value("${app.anthropic.api-key}")
    private String anthropicApiKey;

    private final RestClient restClient = RestClient.create();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String SYSTEM_PROMPT =
            "You are an expert agricultural advisor for the AgroLink marketplace. " +
            "Provide concise, practical advice on crop pricing, growing tips, " +
            "market demand, and best practices. Keep responses under 200 words, " +
            "use bullet points, and be specific to the crop and region mentioned.";

    public Map<String, Object> recommend(AIRequest payload) {
        if (anthropicApiKey == null || anthropicApiKey.isBlank()) {
            throw new ApiException(500, "AI service error: ANTHROPIC_API_KEY not configured");
        }

        String prompt = (payload.getQuery() != null && !payload.getQuery().isBlank())
                ? payload.getQuery()
                : String.format(
                        "Provide a market snapshot for %s in %s: current price range per kg/quintal, " +
                        "demand trend, best selling season, and 2 tips to maximize revenue.",
                        payload.getCrop(), payload.getRegion());

        try {
            String requestBody = objectMapper.writeValueAsString(Map.of(
                    "model", "claude-sonnet-4-5-20250929",
                    "max_tokens", 500,
                    "system", SYSTEM_PROMPT,
                    "messages", new Object[]{ Map.of("role", "user", "content", prompt) }
            ));

            String response = restClient.post()
                    .uri("https://api.anthropic.com/v1/messages")
                    .header("x-api-key", anthropicApiKey)
                    .header("anthropic-version", "2023-06-01")
                    .header("content-type", "application/json")
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            JsonNode json = objectMapper.readTree(response);
            String text = json.path("content").get(0).path("text").asText();

            return Map.of(
                    "recommendation", text,
                    "crop", payload.getCrop(),
                    "region", payload.getRegion()
            );
        } catch (Exception e) {
            throw new ApiException(500, "AI service error: " + e.getMessage());
        }
    }
}
