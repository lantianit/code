package org.example.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.example.entity.CarouselImage;
import org.example.entity.R;
import org.example.service.CarouselImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/carouseImage")
@Slf4j
public class CarouseImageController {

    @Resource
    private CarouselImageService carouseImageService;

    @Value("${images.url}")
    private String imagesUrl;

    @GetMapping("/getCarouseImage")
    public R getCarouseImage() {
        List<CarouselImage> list = carouseImageService.list();
        Map<String,Object> map=new HashMap<>();
        map.put("message",list);
        return R.ok(map);
    }

    @PostMapping("/addCarouseImage")
    public R addCarouseImage(@RequestBody CarouselImage carouselImage) {
        carouseImageService.save(carouselImage);
        return R.ok();
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("文件为空，请选择一个文件上传。");
        }

        try {
            // 确保上传目录存在
            File uploadDir = new File(imagesUrl);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // 生成唯一文件名以避免文件名冲突
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            // 将文件保存到指定目录
            Path filePath = Paths.get(imagesUrl, uniqueFileName);
            Files.write(filePath, file.getBytes());
            log.info(" >>> 上传一张图片，图片的url是：" + filePath.toAbsolutePath() + "   >>>");
            // 返回文件路径
            return ResponseEntity.ok(filePath.toString());

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("文件上传失败。");
        }
    }

}
