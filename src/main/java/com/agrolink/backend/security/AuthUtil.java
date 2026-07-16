package com.agrolink.backend.security;

import com.agrolink.backend.exception.ApiException;
import com.agrolink.backend.model.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AuthUtil {

    /** Mirrors: user = Depends(get_current_user) - raises 401 if not authenticated */
    public User requireUser(HttpServletRequest request) {
        Object attr = request.getAttribute(JwtAuthFilter.CURRENT_USER_ATTR);
        if (attr == null) {
            throw new ApiException(401, "Not authenticated");
        }
        return (User) attr;
    }

    /** Mirrors: await require_role(user, [roles]) */
    public void requireRole(User user, List<String> allowedRoles) {
        if (!allowedRoles.contains(user.getRole())) {
            throw new ApiException(403, "Requires role: " + allowedRoles);
        }
    }
}
