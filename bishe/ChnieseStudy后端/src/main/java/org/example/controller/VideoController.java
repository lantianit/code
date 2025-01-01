package org.example.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.example.entity.R;
import org.example.entity.TVideoComment;
import org.example.entity.VO.TVideoCommentVO;
import org.example.entity.Video;
import org.example.service.TVideoCommentService;
import org.example.service.VideoService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(("/video"))
@Slf4j
public class VideoController {

    @Resource
    private VideoService videoService;

    @Resource
    private TVideoCommentService videoCommentService;

    @GetMapping("/getVideoAndCommentByVideoId")
    public R getUserByid(int videoId) {
        List<TVideoCommentVO> comments = videoCommentService.getList(videoId);
        log.info("数据库查询：" + videoCommentService.getList(videoId));
        log.info("comments = " + comments);
        Map<String, Object> map = new HashMap<>();
        map.put("message",comments);
        return R.ok(map);
    }

    @RequestMapping("/getRecommendVideo")
    public R getRecommendVideo() {
        List<Video> bigtypesList = videoService.list(new QueryWrapper<Video>().eq("is_recommend",1));
        Map<String,Object> map=new HashMap<>();
        map.put("message",bigtypesList);
        return R.ok(map);
    }

    @RequestMapping("/getVideoByVideoId")
    public R getVideoById(int videoId) {
        Video video = videoService.getById(videoId);
        Map<String,Object> map=new HashMap<>();
        map.put("message",video);
        return R.ok(map);
    }

    // 接收评论的接口
    @PostMapping("/addComment")
    public boolean addComment(@RequestBody TVideoComment comment) {
        comment.setCreateTime(new Date());
        comment.setUpdateTime(new Date());
        log.info("comment = " + comment);
        if (comment.getVideoId() == null || comment.getVideoId() == 0 || comment.getComment() == null || comment.getComment() == "" || comment.getUserId() == null || comment.getUserId() == 0) {
            return false;
        }
        return videoCommentService.saveComment(comment);
    }

}
