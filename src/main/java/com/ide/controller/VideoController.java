package com.ide.controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/video")
public class VideoController {

    private final Path videoDir = Paths.get("src/main/resources/Video Music").toAbsolutePath();

    @GetMapping("/list")
    public ResponseEntity<List<String>> listVideos() {
        if (!Files.exists(videoDir) || !Files.isDirectory(videoDir)) {
            return ResponseEntity.ok(List.of());
        }

        try (var stream = Files.list(videoDir)) {
            List<String> files = stream
                    .filter(p -> !Files.isDirectory(p))
                    .map(p -> p.getFileName().toString())
                    .filter(name -> name.toLowerCase().endsWith(".mp4") || 
                                    name.toLowerCase().endsWith(".webm"))
                    .sorted()
                    .collect(Collectors.toList());
            return ResponseEntity.ok(files);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/stream")
    public ResponseEntity<Resource> streamVideo(@RequestParam("file") String fileName) {
        if (fileName == null || fileName.contains("..") || fileName.contains("/") || fileName.contains("\\")) {
            return ResponseEntity.badRequest().build();
        }

        Path filePath = videoDir.resolve(fileName);
        if (!Files.exists(filePath) || Files.isDirectory(filePath)) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(filePath.toFile());
        
        HttpHeaders headers = new HttpHeaders();
        String lowerName = fileName.toLowerCase();
        if (lowerName.endsWith(".mp4")) {
            headers.setContentType(MediaType.parseMediaType("video/mp4"));
        } else if (lowerName.endsWith(".webm")) {
            headers.setContentType(MediaType.parseMediaType("video/webm"));
        } else {
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        }
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }
}
