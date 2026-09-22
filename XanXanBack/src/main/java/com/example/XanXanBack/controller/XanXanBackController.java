package com.example.XanXanBack.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class XanXanBackController{
    @GetMapping("/teste")
    public String teste(){
        return "teste";
    }
}