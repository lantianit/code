package org.example.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebAppConfigurer implements WebMvcConfigurer {

    @Value("${images.url}")
    private String imagesUrl;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/image/swiper/**").addResourceLocations("file:"+imagesUrl+"swiper/");
        registry.addResourceHandler("/image/bigtype/**").addResourceLocations("file:"+imagesUrl+"bigtype/");
        registry.addResourceHandler("/image/userphoto/**").addResourceLocations("file:"+imagesUrl+"userphoto/");
    }



}
