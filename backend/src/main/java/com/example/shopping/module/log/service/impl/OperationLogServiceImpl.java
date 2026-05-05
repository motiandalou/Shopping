package com.example.shopping.module.log.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.shopping.module.log.entity.OperationLog;
import com.example.shopping.module.log.mapper.OperationLogMapper;
import com.example.shopping.module.log.service.OperationLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@RequiredArgsConstructor
@Service
public class OperationLogServiceImpl implements OperationLogService {

    private final OperationLogMapper mapper;

    @Override
    public void save(OperationLog log) {
        mapper.insert(log);
    }

    @Override
    public List<OperationLog> list() {
        return mapper.selectList(
                new QueryWrapper<OperationLog>()
                        // 按照创建时间排序
                        .orderByDesc("create_time")
        );
    }
}