package com.example.shopping.common.page;

import com.example.shopping.common.page.PageDTO;
import com.github.pagehelper.PageInfo;
import lombok.Data;
import java.util.List;

@Data
public class PageRespVO<T> {
    // 管控当前业务独有筛选条件（商品名、分类 ID）
    /**
     * 1. 小字典（分类、数据 <500）：全量 Redis 缓存 + JDK 内存分页（build (List,PageDTO)）
     * 2. 常规列表（商品几万～几十万）：PageHelper + MySQL limit （你当前写法）
     * 3. 超大表（百万 + 订单日志）：游标分页 / ES / 分表，抛弃普通 limit 大页码
     */
    private List<T> list;
    private Long total;
    private int pageNum;
    private int pageSize;
    private int pages;

    /** PageHelper PageInfo快速构建
     * 日常业务 PageHelper+limit 够用；海量千万级数据不能只用 limit，要额外优化
     * 坑：limit 偏移量过大变慢: limit 100000,10 → MySQL 需要扫描丢弃前 10 万行，越往后分页越卡。
     * 1. 主键游标分页（替代大 offset 分页）
     * 前端传上一页最大 ID，where id > #{lastId} limit 10，无偏移、速度稳定。
     * 适用：APP 下拉滚动分页。
     * 2. 索引优化: 分页 + 查询条件字段建立联合索引，避免回表全表扫描。
     * 3. ES 搜索引擎分页: 商品、订单海量数据、多条件模糊搜索：MySQL 只存数据，查询丢 ES，ES 做深度分页。
     * 4. 分区表 / 分库分表: 千万级订单按月分表，单表控制在 200w 以内。
     * */
    public static <T> PageRespVO<T> build(PageInfo<T> pageInfo) {
        PageRespVO<T> vo = new PageRespVO<>();
        vo.setList(pageInfo.getList());
        vo.setTotal(pageInfo.getTotal());
        vo.setPageNum(pageInfo.getPageNum());
        vo.setPageSize(pageInfo.getPageSize());
        vo.setPages(pageInfo.getPages());
        return vo;
    }

    /** 内存分页手动构建（小数据全量缓存专用） */
    public static <T> PageRespVO<T> build(List<T> allData, PageDTO pageDTO) {
        PageRespVO<T> vo = new PageRespVO<>();
        long total = allData.size();
        int start = (pageDTO.getPageNum() - 1) * pageDTO.getPageSize();
        List<T> pageList = allData.stream()
                .skip(start)
                .limit(pageDTO.getPageSize())
                .toList();
        vo.setList(pageList);
        vo.setTotal(total);
        vo.setPageNum(pageDTO.getPageNum());
        vo.setPageSize(pageDTO.getPageSize());
        vo.setPages((int) ((total + pageDTO.getPageSize() - 1) / pageDTO.getPageSize()));
        return vo;
    }
}