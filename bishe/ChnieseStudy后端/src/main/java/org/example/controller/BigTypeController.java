package org.example.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.example.entity.Bigtype;
import org.example.entity.R;
import org.example.entity.Video;
import org.example.service.BigtypeService;
import org.example.service.VideoService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bigType")
@Slf4j
public class BigTypeController {

    @Resource
    private BigtypeService bigtypeService;

    @Resource
    private VideoService videoService;

    @Value("${images.url}")
    private String imagesUrl;

    @GetMapping("/getAll")
    public R getAll() {
        List<Bigtype> bigtypesList = bigtypeService.list();
        return R.ok(Map.of("message", bigtypesList));
    }

    @GetMapping("/getBigTypeVideo")
    public R getBigTypeVideo() {
        List<Bigtype> bigtypesList = bigtypeService.list();
        bigtypesList.forEach(bigtype -> {
            List<Video> videos = videoService.list(new QueryWrapper<Video>().eq("type", bigtype.getName()));
            bigtype.setBigTypeVideoList(videos);
        });
        return R.ok(Map.of("message", bigtypesList));
    }
}
