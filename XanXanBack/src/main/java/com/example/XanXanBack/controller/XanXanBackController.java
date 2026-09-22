package com.example.XanXanBack.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.multipart.MultipartFile;   


@RestController
public class XanXanBackController{
    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file){
        return file.getOriginalFilename();
    }
}