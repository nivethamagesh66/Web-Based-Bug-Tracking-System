//package com.bughound.model;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//// ---------------------
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Entity
//@Table(name = "users")
//public class User {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "user_id")
//    private Long id;
//
//    private String name;
//
//    @Column(name = "login_id", unique = true)
//    private String loginId;
//
//    private String password;
//
//    private int level;
//
//    @Column(name = "is_deleted")
//    private boolean isDeleted = false;
//}
package com.bughound.model;

import jakarta.persistence.*;
        import lombok.*;
        import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    private String name;

    @JsonProperty("login_id") // ✅ Fix here
    @Column(name = "login_id", unique = true)
    private String loginId;

    private String password;

    private int level;

    @JsonProperty("is_deleted") // ✅ optional fix if sent from frontend
    @Column(name = "is_deleted")
    private boolean isDeleted = false;
}
