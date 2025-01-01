package org.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.entity.Video;
import org.example.mapper.VideoMapper;
import org.example.service.VideoService;
import org.springframework.stereotype.Service;

/**
* @author 12109
* @description 针对表【video(视频表)】的数据库操作Service实现
* @createDate 2024-11-20 21:24:07
*/
@Service
public class VideoServiceImpl extends ServiceImpl<VideoMapper, Video>
    implements VideoService {

}




