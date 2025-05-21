cmake_minimum_required(VERSION 3.15)
project(SankeyDecoder LANGUAGES CXX)

add_library(SankeyDecoder SHARED
    src/SankeyDecoder.cpp
)

target_include_directories(SankeyDecoder PUBLIC
    ${PROJECT_SOURCE_DIR}/include
)

target_compile_definitions(SankeyDecoder PRIVATE SANKEYDECODER_EXPORTS)

target_link_libraries(SankeyDecoder
    Crypt32
)


set_target_properties(SankeyDecoder PROPERTIES
    OUTPUT_NAME "SankeyDecoder"
    RUNTIME_OUTPUT_DIRECTORY_DEBUG ${CMAKE_BINARY_DIR}/bin/Debug
    RUNTIME_OUTPUT_DIRECTORY_RELEASE ${CMAKE_BINARY_DIR}/bin/Release
)

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/release-1.12.1.zip
)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

enable_testing()

add_executable(SankeyDecoderTests
    tests/test_decrypt.cpp
)

target_link_libraries(SankeyDecoderTests
    GTest::gtest_main
    SankeyDecoder
)

add_custom_command(TARGET SankeyDecoderTests POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
    $<TARGET_FILE:SankeyDecoder>
    $<TARGET_FILE_DIR:SankeyDecoderTests>
)

include(GoogleTest)
gtest_discover_tests(SankeyDecoderTests)
