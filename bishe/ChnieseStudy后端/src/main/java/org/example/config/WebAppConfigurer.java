package org.example.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebAppConfigurer implements WebMvcConfigurer {

    @Value("${images.url}")
    private String imagesUrl;

    private static final String VIDEO_URL = "C:\\application\\gitee\\daily-study\\code\\bishe\\ChnieseStudy后端\\data\\videos\\";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/image/swiper/**").addResourceLocations("file:" + imagesUrl + "swiper/");
        registry.addResourceHandler("/image/bigtype/**").addResourceLocations("file:" + imagesUrl + "bigtype/");
        registry.addResourceHandler("/image/userphoto/**").addResourceLocations("file:" + imagesUrl + "userphoto/");
        registry.addResourceHandler("/videoPlay/**").addResourceLocations("file:" + VIDEO_URL);
    }
}
